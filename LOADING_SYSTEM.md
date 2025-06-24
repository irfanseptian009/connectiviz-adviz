# Loading System Documentation

## Overview
Sistem loading yang telah ditambahkan menyediakan berbagai jenis loading states yang indah dan modern untuk meningkatkan user experience saat berpindah halaman atau melakukan aksi.

## Components

### 1. LoadingOverlay
Overlay loading fullscreen dengan animasi modern yang muncul di atas semua konten.

**Features:**
- Background blur dengan opacity
- Animated spinner dengan multiple layers
- Customizable loading text
- Pulse animation untuk visual feedback
- Dark mode support

### 2. TopLoadingBar
Progress bar di bagian atas halaman yang menunjukkan loading state.

**Features:**
- Gradient color animation
- Fixed positioning di top
- Smooth loading bar animation

### 3. PageLoader
Loader yang dapat digunakan untuk konten halaman spesifik.

**Props:**
- `text`: Custom loading text
- `size`: 'sm' | 'md' | 'lg'
- `className`: Additional CSS classes

### 4. LoadingButton
Button dengan loading state built-in.

**Props:**
- `isLoading`: Boolean untuk loading state
- `loadingText`: Text yang muncul saat loading
- `onClick`: Click handler
- `disabled`: Disable button
- `className`: Additional CSS classes

### 5. Skeleton Components
Placeholder loading untuk berbagai jenis konten.

**Available Components:**
- `Skeleton`: Basic skeleton with variants
- `CardSkeleton`: Skeleton untuk card layout
- `TableSkeleton`: Skeleton untuk table layout
- `PageSkeleton`: Skeleton untuk entire page

## Context & Hooks

### LoadingContext
Global state management untuk loading.

**Methods:**
- `showLoading(text?)`: Show loading overlay
- `hideLoading()`: Hide loading overlay
- `setLoading(boolean)`: Set loading state
- `setLoadingText(string)`: Set loading text

### useNavigationWithLoading
Hook untuk navigasi dengan loading state.

**Methods:**
- `navigateWithLoading(path, loadingText?)`: Navigate dengan loading
- `replaceWithLoading(path, loadingText?)`: Replace route dengan loading
- `backWithLoading(loadingText?)`: Go back dengan loading

## Usage Examples

### Basic Navigation dengan Loading
```tsx
import { useNavigationWithLoading } from '@/hooks/useNavigationWithLoading';

function MyComponent() {
  const { navigateWithLoading } = useNavigationWithLoading();
  
  return (
    <button onClick={() => navigateWithLoading('/dashboard', 'Loading Dashboard...')}>
      Go to Dashboard
    </button>
  );
}
```

### Manual Loading Control
```tsx
import { useLoading } from '@/context/LoadingContext';

function MyComponent() {
  const { showLoading, hideLoading } = useLoading();
  
  const handleAction = async () => {
    showLoading('Processing...');
    try {
      await someAsyncAction();
    } finally {
      hideLoading();
    }
  };
  
  return <button onClick={handleAction}>Process</button>;
}
```

### Loading Button
```tsx
import LoadingButton from '@/components/common/LoadingButton';

function MyComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitForm();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <LoadingButton
      isLoading={isSubmitting}
      onClick={handleSubmit}
      loadingText="Submitting..."
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Submit Form
    </LoadingButton>
  );
}
```

### Skeleton Loading
```tsx
import { PageSkeleton, CardSkeleton } from '@/components/common/Skeleton';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <PageSkeleton />;
  }
  
  return <div>Content loaded!</div>;
}
```

## Customization

### Custom Animations
Tambahkan animasi custom di `globals.css`:

```css
@keyframes your-animation {
  0% { /* start state */ }
  100% { /* end state */ }
}

.your-custom-class {
  animation: your-animation 1s ease-in-out infinite;
}
```

### Theme Support
Semua komponen mendukung dark mode secara otomatis menggunakan Tailwind's dark variant.

### Performance Tips
1. Gunakan loading state untuk operasi yang membutuhkan waktu > 300ms
2. Berikan loading text yang deskriptif untuk user feedback yang baik
3. Hindari terlalu banyak animasi simultan untuk performa yang optimal

## Integration
Sistem loading sudah terintegrasi dengan:
- ✅ Sidebar navigation
- ✅ Header navigation  
- ✅ Global providers
- ✅ Route changes
- ✅ Browser back/forward navigation

Semua navigasi di sidebar dan header sudah secara otomatis menggunakan loading state.
