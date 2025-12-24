import { Task } from '@lit/task';
import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getYarnDiff, getYarnVersions, type YarnDiffEntry } from '../utils/legacyfabric-meta';

@customElement('lf-mappings-diff')
export class MappingsDiffElement extends LitElement {
    @property({ type: String })
    minecraftVersion: string | null = null;

    @property({ type: Number })
    mappingFrom: string | null = null;

    @property({ type: Number })
    mappingTo: string | null = null;

    @property({ type: Object })
    diffClasses: Partial<Record<string, YarnDiffEntry[]>> = {};

    @property({ type: Object })
    diffFields: Partial<Record<string, YarnDiffEntry[]>> = {};

    @property({ type: Object })
    diffMethods: Partial<Record<string, YarnDiffEntry[]>> = {};

    //#region Render

    render() {
        return html`
            <h2>Mappings Diff</h2>
            <div class="diff">
                <label for="mapping-from">From:</label>
                <select id="mapping-from" @change=${this.updateDiffFrom}>
                    ${this.initYarnVersionsTask.render({
                        pending: () => html`<option>loading</option>`,
                        complete: (versionList) => {
                            return versionList.map((data) => {
                                return html`<option value=${data.version}>${data.build}</option>`;
                            });
                        },
                        error: (error) => {
                            console.error(error);
                            return html`<option>error</option>`;
                        }
                    })}
                </select>

                <label for="mapping-to">To:</label>
                <select id="mapping-to" @change=${this.updateDiffTo}>
                    ${this.initYarnVersionsTask.render({
                        pending: () => html`<option>loading</option>`,
                        complete: (versionList) => {
                            return versionList.map((data) => {
                                return html`<option value=${data.version}>${data.build}</option>`;
                            });
                        },
                        error: (error) => {
                            console.error(error);
                            return html`<option>error</option>`;
                        }
                    })}
                </select>

                <br />

                ${this.renderTotalDiff()}
            </div>
        `;
    }

    private renderTotalDiff() {
        let htmlArray = [];

        if (Object.keys(this.diffClasses).length > 0) {
            htmlArray.push(html`
                <h3>Classes</h3>
                <div id="diff-classes">${Object.entries(this.diffClasses).map(([owner, diffs]) => this.renderDiffGroup(owner, diffs))}</div>
            `);
        }
        if (Object.keys(this.diffFields).length > 0) {
            htmlArray.push(html`
                <h3>Fields</h3>
                <div id="diff-fields">${Object.entries(this.diffFields).map(([owner, diffs]) => this.renderDiffGroup(owner, diffs))}</div>
            `);
        }
        if (Object.keys(this.diffMethods).length > 0) {
            htmlArray.push(html`
                <h3>Methods</h3>
                <div id="diff-methods">${Object.entries(this.diffMethods).map(([owner, diffs]) => this.renderDiffGroup(owner, diffs))}</div>
            `);
        }

        return htmlArray;
    }

    private renderDiffGroup(owner: string, diffs?: YarnDiffEntry[]) {
        if (owner == null || diffs == null) {
            console.warn('renderDiffGroup was called with null!');
            return nothing;
        }

        return html`
            <h4>${owner}</h4>
            <ul>
                ${diffs.map((diff) => this.renderDiffEntry(diff))}
            </ul>
        `;
    }

    private renderDiffEntry(diff: YarnDiffEntry) {
        return html`
            <li>
                ${diff.source} ${diff.sourceDesc} <br />
                -> ${diff.target} ${diff.targetDesc}
            </li>
        `;
    }

    //#endregion

    private initYarnVersionsTask = new Task(this, {
        task: async () => {
            let versions = await getYarnVersions(this.minecraftVersion!);
            this.mappingFrom = versions[0].version;
            this.mappingTo = versions[0].version;
            return versions;
        },
        args: () => []
    });

    private updateDiffFrom(e: Event) {
        this.mappingFrom = (e.target as HTMLSelectElement).value;
        console.log('Mapping From: ' + this.mappingFrom);
        this.updateDiff();
    }

    private updateDiffTo(e: Event) {
        this.mappingTo = (e.target as HTMLSelectElement).value;
        console.log('Mapping To: ' + this.mappingTo);
        this.updateDiff();
    }

    private async updateDiff() {
        if (this.mappingFrom && this.mappingTo) {
            let diff = await getYarnDiff(this.mappingFrom, this.mappingTo);
            this.diffClasses = Object.groupBy(diff.classes, (entry) => entry.owner);
            this.diffFields = Object.groupBy(diff.fields, (entry) => entry.owner);
            this.diffMethods = Object.groupBy(diff.methods, (entry) => entry.owner);
        }
    }
}
