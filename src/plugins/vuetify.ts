import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify, type ThemeDefinition } from 'vuetify';

const customDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#172027',
    surface: '#2f3e46',
    primary: '#52796f',
    'primary-darken-1': '#354f52',
    secondary: '#ffd166',
    'secondary-darken-1': '#f9c74f',
    error: '#bc4749',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
};

const customLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#e6eae4',
    surface: '#cad2c5',
    primary: '#52796f',
    'primary-darken-1': '#354f52',
    secondary: '#ffd166',
    'secondary-darken-1': '#f9c74f',
    error: '#bc4749',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'customLightTheme',
    themes: {
      customDarkTheme,
      customLightTheme,
    },
  },
  display: {
    mobileBreakpoint: 'xs',
    thresholds: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  defaults: {
    VTextField: {
      variant: 'outlined',
      color: 'secondary',
      density: 'compact',
    },
    VTextarea: {
      variant: 'outlined',
      color: 'secondary',
      density: 'compact',
    },
    VCombobox: {
      variant: 'outlined',
      color: 'secondary',
      density: 'compact',
    },
    VSelect: {
      variant: 'outlined',
      color: 'secondary',
      density: 'compact',
    },
    VSwitch: {
      color: 'secondary',
    },
    VRadioGroup: {
      color: 'secondary',
    },
    VRadio: {
      color: 'secondary',
    },
    VSnackbar: {
      color: '#333',
    },
  },
});

export default vuetify;
