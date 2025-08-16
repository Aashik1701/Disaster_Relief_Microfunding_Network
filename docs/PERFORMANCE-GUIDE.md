# Performance Optimization Guide

This guide covers the comprehensive performance optimization strategies implemented in the Avalanche Disaster Relief Network frontend application.

## 📊 Performance Monitoring

### Built-in Performance Dashboard

The application includes a development-only performance dashboard accessible via the purple monitor button in the bottom-right corner:

- **Real-time FPS monitoring** - Track frame rate for smooth animations
- **Memory usage tracking** - Monitor heap size and memory leaks
- **Component render times** - Identify performance bottlenecks
- **Bundle analysis** - View chunk sizes and load times
- **Core Web Vitals** - LCP, FID, and CLS metrics

### Performance Utilities

```javascript
import { performanceMonitor } from '@/utils/performance';

// Mark performance timing
performanceMonitor.mark('operation-start');

// Measure duration
performanceMonitor.measure('operation-start');

// Track component render
const TrackedComponent = performanceMonitor.trackComponentRender(
  'MyComponent', 
  MyComponent
);
```

## 🚀 Code Splitting

### Route-based Splitting

All major routes are lazy-loaded with optimized chunking:

```javascript
// Automatic route chunking
const HomePage = createLazyRoute(() => import('@/pages/HomePage'), { 
  chunkName: 'home' 
});

// Manual chunk grouping
{
  'react-vendor': ['react', 'react-dom'],
  'web3-vendor': ['ethers'],
  'ui-vendor': ['framer-motion', 'lucide-react']
}
```

### Component-level Splitting

```javascript
import { LazySection } from '@/utils/codeSplitting';

// Lazy load sections on scroll
<LazySection 
  threshold={0.1} 
  fallback={<LoadingSpinner />}
>
  <ExpensiveComponent />
</LazySection>
```

### Bundle Analysis

Run bundle analysis to identify optimization opportunities:

```bash
# Generate visual bundle analysis
npm run build:analyze

# View bundle composition
npm run analyze
```

## 🖼️ Image Optimization

### Optimized Image Component

The `OptimizedImage` component provides comprehensive image optimization:

```javascript
import { OptimizedImage } from '@/components/UI/OptimizedImage';

<OptimizedImage
  src="/hero-image.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  quality={80}
  responsive
  priority // For above-the-fold images
  placeholder="blur"
/>
```

### Features

- **WebP support** - Automatic format detection and conversion
- **Responsive images** - Multiple sizes for different viewports
- **Lazy loading** - Intersection Observer-based loading
- **Progressive loading** - Low-quality placeholders
- **Error handling** - Graceful fallbacks

### Image Optimization Strategies

1. **Use appropriate formats**:
   - WebP for modern browsers
   - JPEG for photos
   - PNG for graphics with transparency
   - SVG for icons and simple graphics

2. **Optimize dimensions**:
   - Serve images at display size
   - Use responsive breakpoints
   - Implement art direction for mobile

3. **Lazy loading**:
   - Load images only when needed
   - Use intersection observer
   - Implement progressive enhancement

## 💾 Caching Strategies

### API Response Caching

```javascript
import { useCache } from '@/hooks/useCache';

const { data, loading, error } = useCache(
  'disaster-data',
  () => fetchDisasterData(),
  {
    ttl: 5 * 60 * 1000, // 5 minutes
    persist: true
  }
);
```

### Service Worker Caching

Automatic caching for:
- Static assets (JS, CSS, images)
- API responses
- Font files
- External resources

### Memory Management

```javascript
// Clear cache when needed
cache.clear();

// Monitor memory usage
const memory = performanceMonitor.getMemoryUsage();
if (memory.used > memory.limit * 0.8) {
  // Trigger garbage collection
}
```

## ⚡ Build Optimization

### Vite Configuration

Optimized build configuration includes:

```javascript
export default defineConfig({
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Intelligent chunking strategy
          if (id.includes('node_modules/react')) return 'react-vendor';
          if (id.includes('node_modules/ethers')) return 'web3-vendor';
          // ... more chunks
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  }
});
```

### Bundle Optimization

1. **Tree shaking** - Remove unused code
2. **Code splitting** - Load code on demand  
3. **Compression** - Gzip/Brotli compression
4. **Minification** - Terser optimization
5. **Dead code elimination** - Remove unreachable code

## 🎯 Performance Best Practices

### React Optimization

1. **Use React.memo** for expensive components:
```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  // Component implementation
});
```

2. **Optimize useEffect dependencies**:
```javascript
useEffect(() => {
  // Effect logic
}, [specificDependency]); // Only include necessary dependencies
```

3. **Use useMemo for expensive calculations**:
```javascript
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);
```

### Loading States

Implement proper loading states for better UX:

```javascript
import { Skeleton } from '@/components/UI/Skeleton';

{loading ? (
  <Skeleton className="h-32 w-full" />
) : (
  <ActualContent />
)}
```

### Error Boundaries

Prevent cascading failures:

```javascript
import { ErrorBoundary } from '@/components/UI/ErrorBoundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <RiskyComponent />
</ErrorBoundary>
```

## 📱 Mobile Performance

### Responsive Design

- Mobile-first approach
- Touch-friendly interfaces
- Optimized for small screens
- Reduced data usage

### Performance Considerations

1. **Smaller bundles** for mobile
2. **Optimized images** for mobile viewports
3. **Touch gestures** optimization
4. **Network-aware loading**

## 🔧 Development Tools

### Performance Dashboard

Access via the purple monitor icon (development only):

- Real-time metrics
- Memory monitoring
- FPS tracking
- Bundle analysis
- Performance tips

### Bundle Analysis

```bash
# Analyze bundle composition
npm run build:analyze

# Generate performance report
npm run perf
```

### Browser DevTools

Use browser DevTools for:

- Lighthouse audits
- Performance profiling
- Memory leak detection
- Network analysis

## 📈 Monitoring in Production

### Core Web Vitals

Monitor these key metrics:

- **LCP (Largest Contentful Paint)** < 2.5s
- **FID (First Input Delay)** < 100ms
- **CLS (Cumulative Layout Shift)** < 0.1

### Performance Budget

Maintain these budgets:

- **Initial bundle size**: < 200KB
- **Page load time**: < 3s
- **Time to interactive**: < 5s
- **Memory usage**: < 50MB

## 🚦 Performance Checklist

### Before Deployment

- [ ] Run bundle analysis
- [ ] Check Core Web Vitals
- [ ] Test on slow networks
- [ ] Verify mobile performance
- [ ] Monitor memory usage
- [ ] Test offline functionality

### Regular Monitoring

- [ ] Weekly performance audits
- [ ] Bundle size tracking
- [ ] User experience metrics
- [ ] Error rate monitoring
- [ ] Performance regression tests

## 🔍 Troubleshooting

### Common Issues

1. **Large bundle sizes**:
   - Run bundle analysis
   - Identify heavy dependencies
   - Implement code splitting

2. **Memory leaks**:
   - Use performance dashboard
   - Check for event listeners
   - Monitor component lifecycle

3. **Slow rendering**:
   - Profile component renders
   - Optimize re-renders
   - Use React.memo strategically

### Performance Tools

- **React DevTools Profiler**
- **Chrome DevTools Performance**
- **Lighthouse**
- **WebPageTest**
- **Bundle Analyzer**

## 📚 Additional Resources

- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Bundle Optimization](https://webpack.js.org/guides/bundle-analysis/)

---

This performance optimization implementation ensures the Avalanche Disaster Relief Network delivers a fast, efficient, and scalable user experience across all devices and network conditions.
