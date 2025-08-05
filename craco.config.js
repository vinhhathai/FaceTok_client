const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // Core aliases
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@common': path.resolve(__dirname, 'src/common'),
      
      // Module aliases
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@auth': path.resolve(__dirname, 'src/modules/auth'),
      '@user': path.resolve(__dirname, 'src/modules/user'),
      '@message': path.resolve(__dirname, 'src/modules/message'),
      '@friend': path.resolve(__dirname, 'src/modules/friend'),
      '@post': path.resolve(__dirname, 'src/modules/post'),
      '@notification': path.resolve(__dirname, 'src/modules/notification'),
      
      // Component aliases
      '@components': path.resolve(__dirname, 'src/shared/components'),
      '@hooks': path.resolve(__dirname, 'src/shared/hooks'),
      '@utils': path.resolve(__dirname, 'src/shared/utils'),
      '@contexts': path.resolve(__dirname, 'src/shared/contexts'),
      '@httpClient': path.resolve(__dirname, 'src/shared/httpClient'),
      
      // Redux aliases
      '@redux': path.resolve(__dirname, 'src/core/config'),
      '@store': path.resolve(__dirname, 'src/core/config/store'),
    },
  },
}; 