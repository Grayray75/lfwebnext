import { Task } from '@lit/task';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getYarnDiff, getYarnVersions, type YarnDiffEntry } from '../utils/legacyfabric-meta';
import { repeat } from 'lit/directives/repeat.js';

@customElement('lf-mappings-diff')
export class MappingsDiff extends LitElement {
    @property({ type: String })
    minecraftVersion: string | null = null;

    @property({ type: Number })
    mappingFrom: string | null = null;

    @property({ type: Number })
    mappingTo: string | null = null;

    @property({ type: Array })
    classes: YarnDiffEntry[] = [];

    @property({ type: Array })
    fields: YarnDiffEntry[] = [];

    @property({ type: Array })
    methods: YarnDiffEntry[] = [];

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

                <h3>Classes</h3>
                <div id="diff-classes">
                    <ul>
                        ${repeat(this.classes, this.renderDiffEntry)}
                    </ul>
                </div>
                <h3>Fields</h3>

                <div id="diff-fields">
                    <ul>
                        ${repeat(this.fields, this.renderDiffEntry)}
                    </ul>
                </div>

                <h3>Methods</h3>

                <div id="diff-methods">
                    <ul>
                        ${repeat(this.methods, this.renderDiffEntry)}
                    </ul>
                </div>
            </div>
        `;
    }

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
            this.classes = diff.classes;
            this.methods = diff.methods;
            this.fields = diff.fields;
        }
    }

    private renderDiffEntry(diff: YarnDiffEntry) {
        return html`
            <li>
                ${diff.source} ${diff.sourceDesc} <br />
                -> ${diff.target} ${diff.targetDesc}
            </li>
        `;
    }
}
