import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import LegacyFabricIcon from '/assets/logos/legacyfabric.png'

@customElement('lf-navbar')
export class NavBar extends LitElement {
    render() {
        return html`
            <nav>
                <a class="main-nav" href="/">
                    <img src=${LegacyFabricIcon} alt="" width="32" height="32" />
                    Legacy-Fabric
                </a>
                <a href="/downloads.html">Downloads</a>
                <a href="/usage.html">Usage</a>
                <a href="/mods.html">Mods</a>
                <a href="https://github.com/Legacy-Fabric/">Source</a>
                <a href="/discord">Discord</a>
                <a href="https://status.legacyfabric.net">Status</a>
            </nav>
        `;
    }

    static styles = css`
        nav {
            width: 100%;
            position: fixed;
            background-color: #212529;
            top: 0;
            left: 0;
            font-size: 18px;
            padding-top: 12px;
            padding-bottom: 12px;
        }

        nav a {
            color: #abafcc;
            text-decoration: none;
            padding: 8px;
            transition-duration: 0.25s;
        }

        nav a:hover {
            color: #d0d0d0;
        }

        nav a.main-nav {
            color: #e7e7e7;
            font: 22px system-ui;
            padding-right: 15px;
        }

        nav a.main-nav:hover {
            color: #ffffff;
            text-shadow: 0 0 6px #aaa;
        }

        nav img {
            display: inline-block;
            vertical-align: top;
        }
    `;
}
