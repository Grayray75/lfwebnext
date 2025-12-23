import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { map } from 'lit/directives/map.js';

import type { ModEntry } from '../utils/mods.types';
import mods from '../assets/mods.json';

import CurseforgeIcon from '../assets/logos/curseforge.svg';
import GithubIcon from '../assets/logos/github.svg';
import ModrinthIcon from '../assets/logos/modrinth.svg';

const mcVersions = new Set(
    mods
        .map((m) => m.versions)
        .flat()
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
);

function getModsInVersion(version: string): ModEntry[] {
    return mods.filter((mod) => mod.versions.includes(version));
}

function getModWebsiteIcon(name: string) {
    switch (name) {
        case 'curseforge':
            return CurseforgeIcon;
        case 'github':
            return GithubIcon;
        case 'modrinth':
            return ModrinthIcon;
        default:
            return '';
    }
}

@customElement('lf-mod-list')
export class ModListElement extends LitElement {
    @property({ type: String })
    minecraftVersion = '1.8.9';

    @property({ type: Array })
    mods: ModEntry[] = [];

    render() {
        return html`
            <label for="version-select">Minecraft Version:</label>
            <select id="version-select" @change=${this.updateVersions}>
                ${map(mcVersions, this.renderOption)}
            </select>

            <div style="height: 10px;"></div>

            <table id="mods-table">
                <tr>
                    <th>Name</th>
                    <th>Links</th>
                    <th>Working</th>
                </tr>
                ${repeat(this.mods, this.renderMod)}
            </table>
        `;
    }

    private renderOption(version: string) {
        let selected = version === '1.8.9';
        return html`<option value=${version} ?selected=${selected}>${version}</option>`;
    }

    private renderMod(mod: ModEntry) {
        let links: any = [];
        for (const [site, link] of Object.entries(mod['links'])) {
            links.push(html`<a href=${link as string}><img src=${getModWebsiteIcon(site)} class="mod-link" alt=${site} /></a>`);
        }
        let working = mod.working ? '✔️' : '❌️';

        return html`
            <tr>
                <td>${mod.name}</td>
                <td>${links}</td>
                <td>${working}</td>
            </tr>
        `;
    }

    private async updateVersions(e: Event) {
        this.minecraftVersion = (e.target as HTMLSelectElement).value;

        this.mods = getModsInVersion(this.minecraftVersion);
    }

    static styles = css`
        label {
            font-size: 18px;
            font-weight: 600;
        }

        select {
            font-size: 18px;
            margin: 10px;
            background-color: #292929;
            border: 2px solid #292929;
            border-radius: 4px;
            color: #e0e0e0;
        }

        #mods-table {
            margin-left: auto;
            margin-right: auto;
        }

        #mods-table td:nth-child(1) {
            font-weight: 600;
        }

        #mods-table td:nth-child(2) {
            text-align: left;
            /* max-width: 60px; */
        }

        .mod-link {
            width: 21px;
            height: 21px;
            margin: 0 4px;
        }
    `;
}
