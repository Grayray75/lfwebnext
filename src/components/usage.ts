import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Task } from '@lit/task';
import { getApiVersions, getGameVersions, getLoaderVersions } from '../utils/legacyfabric-meta';

import hljs from 'highlight.js/lib/core';
import hljs_gradle from 'highlight.js/lib/languages/gradle';
hljs.registerLanguage('gradle', hljs_gradle);

@customElement('lf-usage')
export class Usage extends LitElement {
    @property({ type: String })
    minecraftVersion = '1.8.9';

    @property({ type: String })
    yarnVersion = '571';

    @property({ type: String })
    loaderVersion = '0.16.14';

    @property({ type: String })
    apiVersion = '1.12.0';

    render() {
        return html`
            <p>
                Minecraft Version:
                <select name="versions" id="game-versions" @change=${this.updateVersions}>
                    ${this.initGameVersionsTask.render({
                        initial: () => html`<option>Waiting to start task</option>`,
                        pending: () => html`<option>Running task...</option>`,
                        complete: (versionList) => versionList.map((version) => html`<option>${version}</option>`),
                        error: (error) => html`<option>Oops, something went wrong: ${error}</option>`
                    })}
                </select>
            </p>

            <h3>build.gradle</h3>
            <div name="code">
                <pre><code class="gradle" id="build-gradle-code">
dependencies {
    minecraft "com.mojang:minecraft:${this.minecraftVersion}"
    mappings "net.legacyfabric:yarn:${this.yarnVersion}:v2"
    modImplementation "net.fabricmc:fabric-loader:${this.loaderVersion}"

    // Legacy-Fabric API
    modImplementation "net.legacyfabric.legacy-fabric-api:legacy-fabric-api:${this.apiVersion}+${this.minecraftVersion}"
}
                </code></pre>
            </div>

            <h3>gradle.properties</h3>
            <div name="code">
                <pre><code class="properties" id="gradle-properties-code">
minecraft_version=${this.minecraftVersion}
yarn_mappings=${this.yarnVersion}
loader_version=${this.loaderVersion}

# Legacy-Fabric API
fabric_version=${this.apiVersion}+${this.minecraftVersion}
                </code></pre>
            </div>

            <br />
            <hr />

            <h2>Mappings Migration</h2>
            <p>Mappings can be auto updated by using the following command. See the <a href="https://fabricmc.net/wiki/tutorial:migratemappings">wiki page</a> for more help.</p>

            <div name="code">
                <pre><code class="bash">gradlew migrateMappings --mappings "${this.yarnVersion}"</code></pre>
            </div>
        `;
    }

    firstUpdated(_changedProperties: PropertyValues) {
        //console.log(.querySelectorAll("code"));
        this.shadowRoot?.querySelectorAll('code').forEach((block) => {
            console.log(block);
            hljs.highlightElement(block);
        });
    }

    private initGameVersionsTask = new Task(this, {
        task: async () => {
            let gameVersions = await getGameVersions();
            return gameVersions.map((v) => v.version);
        },
        args: () => []
    });

    private async updateVersions(e: Event) {
        let versionSelector = e.target as HTMLSelectElement;
        let selectedOption = versionSelector.selectedOptions[0] as HTMLOptionElement;
        this.minecraftVersion = selectedOption.innerText;

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

    static styles = css`
        div {
            text-align: left;
        }
    `;
}
