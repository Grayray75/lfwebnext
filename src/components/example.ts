import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lf-example')
export class Example extends LitElement {
    @property({ type: Number })
    count = 0;

    render() {
        return html`
            <slot></slot>
            <div class="card">
                <button @click=${this._onClick} part="button">count is ${this.count}</button>
            </div>
        `;
    }

    private _onClick() {
        this.count++;
    }

    static styles = css``;
}
