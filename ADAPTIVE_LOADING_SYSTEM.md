# Adaptive Loading System Documentation

## Overview
Sistem loading adaptif yang menyesuaikan dengan kondisi internet user untuk memberikan pengalaman yang optimal di berbagai kecepatan koneksi.

## Fitur Utama

### 🌐 Network Detection
- **Real-time monitoring**: Mendeteksi kecepatan internet secara real-time
- **Connection types**: Fast, Slow, Offline detection
- **Network API**: Menggunakan Network Information API untuk data akurat
- **Data Saver**: Deteksi mode hemat data

### ⚡ Adaptive Loading Types

#### 1. **Enhanced Loading** (Fast Connection)
- Full animations dengan effects
- Multi-layer spinners
- Gradient progress bars
- Network stats display
- Rich visual feedback

#### 2. **Standard Loading** (Moderate Connection)  
- Standard animations
- Connection status indicators
- Progress information
- Moderate visual effects

#### 3. **Minimal Loading** (Slow Connection/Data Saver)
- Simple spinner only
- No heavy animations
- Basic text feedback
- Optimized for performance

#### 4. **Offline Handling**
- Retry indicators
- Connection lost messages  
- Auto-timeout features
- Fallback UI states

## Components

### AdaptiveLoadingContext
Context provider yang mengelola state loading adaptif.

```tsx
const {
  showLoading,
  hideLoading, 
  networkInfo,
  getLoadingType,
  getLoadingDuration,
  shouldShowDetailedLoading
} = useAdaptiveLoading();
```

### AdaptiveLoadingOverlay
Overlay loading yang menyesuaikan dengan kondisi jaringan.

**Features:**
- Connection-aware animations
- Network quality indicators
- Adaptive progress feedback
- Performance optimizations

### NetworkStatusIndicator
Indikator status jaringan real-time di pojok layar.

**Features:**
- Connection type display
- Speed and latency metrics
- Data saver mode indicator
- Expandable detailed info

## Hooks

### useNetworkStatus()
Hook untuk mendeteksi kondisi jaringan.

```tsx
const networkInfo = useNetworkStatus();
// Returns: isOnline, connectionType, effectiveType, downlink, rtt, saveData
```

### useAdaptiveNavigation()
Hook untuk navigasi dengan loading adaptif.

```tsx
const { 
  navigateWithAdaptiveLoading,
  preloadRoute,
  networkInfo 
} = useAdaptiveNavigation();
```

**Methods:**
- `navigateWithAdaptiveLoading(path, text)`: Navigate dengan adaptive loading
- `preloadRoute(path)`: Preload route untuk fast connections
- `replaceWithAdaptiveLoading(path, text)`: Replace dengan adaptive loading
- `backWithAdaptiveLoading(text)`: Go back dengan adaptive loading

## Adaptations by Connection Type

### 🚀 Fast Connection (4G/WiFi, >5 Mbps)
- **Loading Duration**: 1000ms
- **Type**: Enhanced with full animations
- **Features**: Route preloading, rich visuals
- **Animations**: Multi-layer spinners, gradients

### 🐌 Slow Connection (2G/3G, <5 Mbps)
- **Loading Duration**: 3000ms  
- **Type**: Minimal with performance focus
- **Features**: Detailed progress info, tips
- **Animations**: Simple spinner only

### ❌ Offline Connection
- **Loading Duration**: 5000ms (auto-hide: 10s)
- **Type**: Standard with retry info
- **Features**: Connection status, retry mechanism
- **UI**: Error states, offline indicators

### 💾 Data Saver Mode
- **Loading Duration**: Adaptive
- **Type**: Minimal regardless of speed
- **Features**: Reduced animations, text-only
- **Optimizations**: No preloading, simple UI

## Implementation Examples

### Basic Adaptive Loading
```tsx
import { useAdaptiveLoading } from '@/context/AdaptiveLoadingContext';

function MyComponent() {
  const { showLoading, hideLoading, getLoadingDuration } = useAdaptiveLoading();
  
  const handleAction = async () => {
    showLoading('Processing your request...');
    try {
      await someAsyncAction();
    } finally {
      setTimeout(hideLoading, getLoadingDuration() * 0.3);
    }
  };
}
```

### Adaptive Navigation
```tsx
import { useAdaptiveNavigation } from '@/hooks/useAdaptiveNavigation';

function Navigation() {
  const { navigateWithAdaptiveLoading, preloadRoute } = useAdaptiveNavigation();
  
  return (
    <button
      onClick={() => navigateWithAdaptiveLoading('/dashboard', 'Loading Dashboard...')}
      onMouseEnter={() => preloadRoute('/dashboard')} // Preload on fast connections
    >
      Go to Dashboard
    </button>
  );
}
```

### Network-Aware Component
```tsx
import { useAdaptiveLoading } from '@/context/AdaptiveLoadingContext';

function SmartComponent() {
  const { networkInfo, getLoadingType } = useAdaptiveLoading();
  
  // Conditional rendering based on connection
  if (networkInfo.connectionType === 'slow') {
    return <SimpleView />; // Lightweight version
  }
  
  if (networkInfo.saveData) {
    return <DataSaverView />; // Data-efficient version
  }
  
  return <FullFeaturedView />; // Full experience
}
```

## Performance Optimizations

### Smart Preloading
- **Fast connections**: Preload next likely routes
- **Slow connections**: No preloading to save bandwidth
- **Data saver**: Disabled completely

### Adaptive Timeouts
- **Fast**: Short timeouts (1s)
- **Slow**: Extended timeouts (3-5s)  
- **Offline**: Auto-retry with exponential backoff

### Resource Management
- **Enhanced**: Full assets and animations
- **Standard**: Compressed assets
- **Minimal**: Text-only, essential resources

## Browser Support

### Network Information API
- ✅ Chrome 61+
- ✅ Edge 79+
- ❌ Firefox (experimental)
- ❌ Safari (not supported)
- 🔄 Fallback: Connection speed estimation

### Graceful Degradation
- Deteksi fitur otomatis
- Fallback ke standard loading
- Progressive enhancement approach

## Testing & Debugging

### Chrome DevTools
1. Open DevTools → Network tab
2. Set throttling (Fast 3G, Slow 3G, Offline)
3. Observe adaptive loading behavior

### Manual Testing
```tsx
// Force connection type for testing
const mockNetworkInfo = {
  connectionType: 'slow', // 'fast' | 'slow' | 'offline'
  effectiveType: '2g',
  downlink: 0.5,
  saveData: true
};
```

## Integration Checklist

- ✅ AdaptiveLoadingProvider added to app providers
- ✅ AdaptiveLoadingOverlay component included
- ✅ NetworkStatusIndicator component added
- ✅ Navigation components updated to use adaptive hooks
- ✅ Loading states adapted based on connection
- ✅ Preloading implemented for fast connections
- ✅ Data saver mode handling
- ✅ Offline state management

## Benefits

### User Experience
- **Fast connections**: Rich, engaging loading experience
- **Slow connections**: Clear progress indication, optimized performance
- **Offline scenarios**: Proper error handling and retry mechanisms
- **Data conscious**: Respects user's data preferences

### Performance
- **Bandwidth optimization**: Reduces unnecessary requests on slow connections
- **Battery efficiency**: Minimal animations on mobile/slow connections
- **Memory usage**: Lighter components for constrained environments
- **Load time**: Adaptive timeouts prevent hanging states

### Accessibility  
- **Connection awareness**: Shows appropriate feedback based on user's situation
- **Progress indication**: Clear loading states for all connection types
- **Error handling**: Graceful degradation with helpful messages
- **User control**: Respects system preferences (data saver mode)
