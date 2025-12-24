import { css, html, LitElement, unsafeCSS, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit/task';
import { getApiVersions, getGameVersions, getLoaderVersions } from '../utils/legacyfabric-meta';

import highlightjs_style_dark from 'highlight.js/styles/github-dark-dimmed.css?inline';

@customElement('lf-usage')
export class Usage extends LitElement {
    @property({ type: String })
    minecraftVersion = '1.8.9';

    @property({ type: String })
    yarnVersion = '571';

    @property({ type: String })
    loaderVersion = '0.17.3';

    @property({ type: String })
    apiVersion = '1.12.0';

    render() {
        return html`
            <p>
                Minecraft Version:
                <select name="versions" id="game-versions" @change=${this.updateVersions}>
                    ${this.initGameVersionsTask.render({
                        pending: () => html`<option>loading</option>`,
                        complete: (versionList) => {
                            return versionList.map((version) => {
                                let selected = version === '1.8.9';
                                return html`<option value=${version} ?selected=${selected}>${version}</option>`;
                            });
                        },
                        error: (error) => {
                            console.error(error);
                            return html`<option>error</option>`;
                        }
                    })}
                </select>
            </p>

            <h3>build.gradle</h3>
            <div name="code">
                <pre><code id="build-gradle-code" class="gradle hljs language-gradle">
<span class="hljs-keyword">dependencies</span> {
    <span class="hljs-string">minecraft "com.mojang:minecraft:${this.minecraftVersion}"</span>
    <span class="hljs-string">mappings "net.legacyfabric:yarn:${this.yarnVersion}:v2"</span>
    <span class="hljs-string">modImplementation "net.fabricmc:fabric-loader:${this.loaderVersion}"</span>

    <span class="hljs-comment">// Legacy-Fabric API</span>
    modImplementation <span class="hljs-string">"net.legacyfabric.legacy-fabric-api:legacy-fabric-api:${this.apiVersion}+${this
                    .minecraftVersion}"</span>
}
                </code></pre>
            </div>

            <h3>gradle.properties</h3>
            <div name="code">
                <pre><code id="gradle-properties-code" class="properties hljs language-gradle">
<span class="hljs-attr">minecraft_version</span>=<span class="hljs-string">${this.minecraftVersion}</span>
<span class="hljs-attr">yarn_mappings</span>=<span class="hljs-string">${this.yarnVersion}</span>
<span class="hljs-attr">loader_version</span>=<span class="hljs-string">${this.loaderVersion}</span>

<span class="hljs-comment"># Legacy-Fabric API</span>
<span class="hljs-attr">fabric_version</span>=<span class="hljs-string">${this.apiVersion}+${this.minecraftVersion}</span>
                </code></pre>
            </div>

            <br />
            <hr />

            <h2>Mappings Migration</h2>
            <p>
                Mappings can be auto updated by using the following command. See the
                <a href="https://fabricmc.net/wiki/tutorial:migratemappings">wiki page</a> for more help.
            </p>

            <div name="code">
                <pre><code class="bash hljs">
gradlew migrateMappings --mappings <span class="hljs-string">"${this.yarnVersion}"</span>
                </code></pre>
            </div>

            <br />
            <hr />

            <lf-mappings-diff .minecraftVersion=${this.minecraftVersion}></lf-mappings-diff>
        `;
    }

    firstUpdated(_changedProperties: PropertyValues): void {
        // TODO: Remove this little hack
        this.updateVersions({ target: { value: '1.8.9' } } as any);
    }

    private initGameVersionsTask = new Task(this, {
        task: async () => {
            let gameVersions = await getGameVersions();
            return gameVersions.map((v) => v.version);
        },
        args: () => []
    });

    private async updateVersions(e: Event) {
        this.minecraftVersion = (e.target as HTMLSelectElement).value;

        // TODO: Show error in the ui

        try {
            let loaderVersionsData = await getLoaderVersions(this.minecraftVersion);
            this.loaderVersion = loaderVersionsData[0].loader.version;
            this.yarnVersion = loaderVersionsData[0].mappings.version;
        } catch (error) {
            console.error(error);
        }

        try {
            let apiVersionsData = await getApiVersions();
            let apiVersions = apiVersionsData.map((e) => e.version_number);
            console.log('Found these api versions:', apiVersions);
            this.apiVersion = apiVersions[0];
        } catch (error) {
            console.error(error);
        }
    }

    // TODO: Load highlightjs styles from node_modules?
    static styles = css`
        ${unsafeCSS(highlightjs_style_dark)}

        :host {
            width: clamp(670px, 100%, 1000px);
        }

        div[name='code'] {
            text-align: left;
        }
    `;
}
