import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            dark: {
                primary: '#112D4E',
                secondary: '#3F72AF',
                accent: '#DBE2EF',
                // error: '#F9F7F7',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
            },
            light: {
                primary: '#112D4E',
                secondary: '#3F72AF',
                accent: '#DBE2EF',
                // error: '#F9F7F7',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107',
            }
        }
    }
});
