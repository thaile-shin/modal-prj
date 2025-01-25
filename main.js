const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

{
    /* <div class="modal-backdrop">
    <div class="modal-container">
        <button class="modal-close">&times;</button>
        <div class="modal-content">
            <p>
                .....
            </p>
        </div>
    </div>
</div> */
}

function Modal(options = {}) {
    const {
        templateId,
        destroyOnClose = true,
        cssClass = [],
        closeMethod = ["button", "overlay", "escape"],
    } = options;
    const template = $(`#${templateId}`);
    if (!template) {
        console.error(`${templateId} does not exist`);
        return;
    }

    // Caculate scrollbar width
    function getScrollbarWidth() {
        if (getScrollbarWidth.value) return getScrollbarWidth.value;

        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });
        document.body.appendChild(div);

        const scrollbarWidth = div.offsetWidth - div.clientWidth;

        document.body.removeChild(div);

        getScrollbarWidth.value = scrollbarWidth;

        return scrollbarWidth;
    }

    this._allowButtonClose = closeMethod.includes("button");
    this._allowBackdropClose = closeMethod.includes("overlay");
    this._allowEscapeClose = closeMethod.includes("escape");

    this.build = () => {
        // Create modal elements
        this._backdrop = document.createElement("div");
        this._backdrop.className = "modal-backdrop";

        const container = document.createElement("div");
        container.className = "modal-container";

        cssClass.forEach(className => {
            if (typeof className === 'string') {
                container.classList.add(className);
            }
        });

        if (this._allowButtonClose) {
            const closeBtn = document.createElement("button");
            closeBtn.className = "modal-close";
            closeBtn.innerHTML = "&times;";

            container.append(closeBtn);
            closeBtn.addEventListener("click", () => {
                this.close();
            });
        }

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        const content = template.content.cloneNode(true);

        // Append content and elements
        modalContent.append(content);
        container.append(modalContent);
        this._backdrop.append(container);
        document.body.append(this._backdrop);
    }

    this.open = () => {
        if(!this._backdrop) {
            this.build();
        }

        setTimeout(() => {
            this._backdrop.classList.add("show");
        }, 0);

        // Attach event listener
        if (this._allowBackdropClose) {
            this._backdrop.onclick = (e) => {
                if (e.target === this._backdrop) {
                    this.close();
                }
            };
        }
        if (this._allowEscapeClose) {
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    this.close();
                }
            });
        }

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = getScrollbarWidth() + "px";
        return this._backdrop;
    };
    this.close = (destroy = destroyOnClose) => {
        this._backdrop.classList.remove("show");
        this._backdrop.ontransitionend = () => {
            if(this._backdrop && destroy) {
                this._backdrop.remove();
                this._backdrop = null;
            }

            // Enable scrolling
            document.body.classList.remove("no-scroll");
        };
    };

    this.destroy = () => {
        this.close(true);
    }
}

const modal1 = new Modal({
    templateId: `modal-1`,
    destroyOnClose: false,
});

$("#open-modal-1").onclick = () => {
    modal1.open();
};
const modal2 = new Modal({
    templateId: `modal-2`,
    cssClass: ["class1", "class2", "class3"],
});
$("#open-modal-2").onclick = () => {
    const modalElement = modal2.open();
    // get elements in Modal
    const form = modalElement.querySelector("#login-form");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = {
                email: $("#email").value.trim(),
                password: $("#password").value.trim(),
            };
        };
    }
};
