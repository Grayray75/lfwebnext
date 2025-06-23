import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const images = [
    { title: 'Development', link: '/assets/showcase/dev.png' },
    { title: 'Drawers mod', link: '/assets/showcase/drawers.png' },
    { title: 'Hypixel', link: '/assets/showcase/hypixel.png' },
    { title: 'Meta API', link: '/assets/showcase/meta.png' },
    { title: 'Modmenu', link: '/assets/showcase/modmenu.png' },
    { title: 'Wither', link: '/assets/showcase/wither.png' }
];

@customElement('lf-showcase-gallery')
export class ShowcaseGallery extends LitElement {
    @property({ type: Number })
    index = 0;

    render() {
        return html`
            <h3>Showcase:</h3>
            <div class="gallery">
                <img id="gallery-image" src="${images[this.index].link}" alt="image failed to load :(" />
                <p class="gallery-text" id="gallery-subtitle">${images[this.index].title}</p>
                <p class="gallery-text" id="gallery-count" style="font-size: 12px; bottom: -10px">${this.index + 1}/${images.length}</p>

                <p class="gallery-prev" @click=${this.prevImage}>&#10094;</p>
                <p class="gallery-next" @click=${this.nextImage}>&#10095;</p>
            </div>
        `;
    }

    private prevImage() {
        this.index = this.index === 0 ? images.length - 1 : this.index - 1;
    }

    private nextImage() {
        this.index = (this.index + 1) % images.length;
    }

    static styles = css`
        .gallery {
            position: relative;
            margin: auto;

            /* For centering the alt text and buttons */
            display: flex;
            align-items: center;
            justify-content: center;

            background-color: #212529;
            box-shadow: 0 0 1px 1px #212529;

            width: 827px;
            height: 515px;
            overflow: hidden;
        }

        #gallery-image {
            width: 100%;
        }

        .gallery-text {
            position: absolute;
            padding: 0 6px;
            border-radius: 2px;
            font-weight: 500;
            font-size: 18px;
            bottom: 0;
            background-color: #212529;
        }

        .gallery-prev,
        .gallery-next {
            cursor: pointer;
            position: absolute;
            padding: 20px 12px 20px 20px;
            font-weight: bold;
            font-size: 20px;
            transition-duration: 0.25s;
            user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
        }

        .gallery-prev:hover,
        .gallery-next:hover {
            color: #ffffff;
            text-shadow: 0 0 6px #aaa;
        }

        .gallery-prev {
            left: 0;
        }

        .gallery-next {
            right: 0;
        }
    `;
}
