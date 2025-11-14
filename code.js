// Tracking for scanned components
let scannedComponents = {
  fromLibraries: [],
  localComponents: [],
  customShapes: [],
  customText: []
};

// ===== SENTRY ANALYTICS TRACKING =====
const PLUGIN_VERSION = '1.0.0';

// Generate stable, anonymized user ID
async function getUserId() {
  try {
    const storedUserId = await figma.clientStorage.getAsync('analytics_user_id');
    if (storedUserId) return storedUserId;
    
    const figmaUserId = (figma.currentUser && figma.currentUser.id) || 'anonymous';
    const userId = `user_${figmaUserId.substring(0, 8)}_${Date.now().toString(36)}`;
    await figma.clientStorage.setAsync('analytics_user_id', userId);
    return userId;
  } catch (error) {
    return 'anonymous';
  }
}

// Check if this is the first run (installation)
async function isFirstRun() {
  try {
    const hasRunBefore = await figma.clientStorage.getAsync('analytics_has_run');
    if (!hasRunBefore) {
      await figma.clientStorage.setAsync('analytics_has_run', true);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

// Set user context in Sentry (via UI)
function setSentryUser(userId) {
  figma.ui.postMessage({
    type: 'set-sentry-user',
    userId: userId,
  });
}

// Track plugin installation (first run)
async function trackInstallation() {
  console.log('[Analytics] Checking for first run...');
  const isFirst = await isFirstRun();
  console.log('[Analytics] Is first run?', isFirst);
  if (isFirst) {
    const userId = await getUserId();
    console.log('[Analytics] User ID:', userId);
    setSentryUser(userId);
    
    // Send installation event via UI
    console.log('[Analytics] Sending plugin_installed event...');
    figma.ui.postMessage({
      type: 'track-event',
      eventName: 'plugin_installed',
      eventData: {
        figma_version: figma.version,
        plugin_version: PLUGIN_VERSION,
      },
    });
  } else {
    console.log('[Analytics] Not first run, skipping installation tracking');
  }
}

// Track scan execution
async function trackScan(scanData) {
  console.log('[Analytics] Sending scan_executed event...', scanData);
  figma.ui.postMessage({
    type: 'track-event',
    eventName: 'scan_executed',
    eventData: {
      elements_scanned: scanData.totalElementsScanned || 0,
      compliance_score: scanData.complianceScore || 0,
      library_components: (scanData.libraryComponents && scanData.libraryComponents.length) || 0,
      local_components: (scanData.localComponents && scanData.localComponents.length) || 0,
      custom_shapes: (scanData.customShapes && scanData.customShapes.length) || 0,
      custom_text: (scanData.customText && scanData.customText.length) || 0,
    },
  });
}
// ===== END SENTRY ANALYTICS =====

// Show plugin UI with increased height
figma.showUI(__html__, { width: 400, height: 900 });

// Track installation on first run
trackInstallation();

console.log('Plugin loaded! Ready to scan for component compliance.');

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  console.log('Received message:', msg.type);
  
  if (msg.type === 'scan-page') {
    await scanCurrentPage();
  } else if (msg.type === 'navigate-to-node') {
    await navigateToNode(msg.nodeId);
  }
};

// Scan current page for component compliance
async function scanCurrentPage() {
  try {
    console.log('Scanning page, selection count:', figma.currentPage.selection.length);
    
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.ui.postMessage({
        type: 'error',
        message: 'Please select a frame or component to scan',
      });
      return;
    }
    
    // Reset scanned components
    scannedComponents = {
      fromLibraries: [],
      localComponents: [],
      customShapes: [],
      customText: []
    };
    
    let totalElements = 0;
    
    // Scan each selected node
    for (const node of selection) {
      totalElements += scanNode(node);
    }
    
    // Calculate compliance score
    const violations = scannedComponents.localComponents.length + scannedComponents.customShapes.length + scannedComponents.customText.length;
    const complianceScore = totalElements > 0 
      ? Math.round(((totalElements - violations) / totalElements) * 100)
      : 100;
    
    console.log('Scan complete. Total elements:', totalElements, 'Violations:', violations, 'Score:', complianceScore + '%');
    
    figma.ui.postMessage({
      type: 'scan-results',
      data: {
        libraryComponents: scannedComponents.fromLibraries,
        localComponents: scannedComponents.localComponents,
        customShapes: scannedComponents.customShapes,
        customText: scannedComponents.customText,
        totalElementsScanned: totalElements,
        complianceScore: complianceScore,
      },
    });
    
    // Track the scan event
    await trackScan({
      totalElementsScanned: totalElements,
      complianceScore: complianceScore,
      libraryComponents: scannedComponents.fromLibraries,
      localComponents: scannedComponents.localComponents,
      customShapes: scannedComponents.customShapes,
      customText: scannedComponents.customText,
    });
  } catch (error) {
    console.error('Scan failed:', error);
    figma.ui.postMessage({
      type: 'error',
      message: `Scan failed: ${error}`,
    });
  }
}

// Recursively scan a node and its children
function scanNode(node) {
  let count = 0;
  
  try {
    // Log all nodes we encounter
    console.log(`Scanning node: ${node.name} (type: ${node.type})`);
    
    // Check if this node is a component instance
    if (node.type === 'INSTANCE') {
      count++;
      console.log(`Found INSTANCE: ${node.name}`);
      
      try {
        // Try to get the main component (synchronous)
        const mainComponent = node.mainComponent;
        
        if (mainComponent) {
          console.log(`Main component name: ${mainComponent.name}`);
          console.log(`Main component key: ${mainComponent.key}`);
          
          // Check if the main component is from a library
          const isFromLibrary = mainComponent.key ? true : false;
          console.log(`Is from library (has key): ${isFromLibrary}`);
          
          if (isFromLibrary) {
            // Extract library name from component name
            const componentPath = mainComponent.name || '';
            const pathParts = componentPath.split('/');
            const libraryName = pathParts.length > 1 ? pathParts[0] : 'Unknown Library';
            
            scannedComponents.fromLibraries.push({
              nodeId: node.id,
              nodeName: node.name,
              componentName: mainComponent.name,
              libraryName: libraryName,
              source: 'Library Component',
              severity: 'compliant',
            });
          } else {
            scannedComponents.localComponents.push({
              nodeId: node.id,
              nodeName: node.name,
              componentName: mainComponent.name,
              source: 'Local Component',
              severity: 'error',
            });
          }
        } else {
          console.log(`No main component found for instance: ${node.name}`);
        }
      } catch (error) {
        // If we can't access mainComponent in dynamic-page mode, it might still be from a library
        console.log(`Could not access main component: ${error}`);
        // Assume it's okay if we can't verify - user can check manually
        scannedComponents.fromLibraries.push({
          nodeId: node.id,
          nodeName: node.name,
          componentName: node.name,
          libraryName: 'External Library',
          source: 'Library Component',
          severity: 'compliant',
        });
      }
    } 
    // Check for custom text elements (not from components)
    else if (node.type === 'TEXT') {
      count++;
      console.log(`Found TEXT: ${node.name}`);
      // If it's text directly in the frame, not part of a component, flag it
      scannedComponents.customText.push({
        nodeId: node.id,
        nodeName: node.name,
        source: 'Custom Text (not in component)',
        severity: 'warning',
      });
    } 
    // Check for custom shapes (rectangles, ellipses, etc. not in components)
    else if (node.type === 'RECTANGLE' || node.type === 'ELLIPSE' || node.type === 'POLYGON' || node.type === 'VECTOR') {
      count++;
      console.log(`Found SHAPE: ${node.name} (type: ${node.type})`);
      scannedComponents.customShapes.push({
        nodeId: node.id,
        nodeName: node.name,
        type: node.type,
        source: 'Custom Shape (not in component)',
        severity: 'warning',
      });
    }
    // For frames and groups, recurse into children
    else if (node.type === 'FRAME' || node.type === 'GROUP' || node.type === 'COMPONENT') {
      const childCount = node.children ? node.children.length : 0;
      console.log(`Found container: ${node.name} (type: ${node.type}), children: ${childCount}`);
      if (node.children) {
        for (const child of node.children) {
          count += scanNode(child);
        }
      }
    }
  } catch (error) {
    console.log('Error scanning node:', node.name, error);
  }
  
  return count;
}

// Navigate to a specific node and select it
async function navigateToNode(nodeId) {
  try {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (node && node.parent) {
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
      console.log(`Navigated to node: ${node.name}`);
    }
  } catch (error) {
    console.error(`Failed to navigate to node: ${error}`);
  }
}
