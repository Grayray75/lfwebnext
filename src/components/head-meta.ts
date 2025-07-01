import { LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { html } from 'lit/static-html.js';

@customElement('lf-meta')
export class LfMeta extends LitElement {
    render() {
        return html`
            <meta property="og:site_name" content="Legacy Fabric - Home" />
            <meta property="og:title" content="Legacy Fabric" />
            <meta property="og:url" content="https://legacyfabric.net/" />
            <meta property="og:image" content="https://legacyfabric.net/res/img/logo.png" />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:description" content="The home of legacy version support for Fabric." />
        `;
    }

    // Disable shadow DOM for this
    createRenderRoot() {
        return this;
    }
}
