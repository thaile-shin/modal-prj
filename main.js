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
        footer = false,
        cssClass = [],
        closeMethod = ["button", "overlay", "escape"],
        onOpen,
        onClose,
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

        cssClass.forEach((className) => {
            if (typeof className === "string") {
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

        if (footer) {
            this._modalFooter = document.createElement("div");
            this._modalFooter.className = "modal-footer";

            if(this._footerContent) {
                this._modalFooter.innerHTML = this._footerContent;
            }
            container.append(this._modalFooter);
        }

        this._backdrop.append(container);
        document.body.append(this._backdrop);
    };

    this.setFooterContent = (html) => {
        this._footerContent = html;
        if(this._modalFooter) {
            this._modalFooter.innerHTML = html;
        }

    }

    this.open = () => {
        if (!this._backdrop) {
            this.build();
        }

        this._onTransitionEnd = (callback) => {
            this._backdrop.ontransitionend = (e) => {
                if (e.propertyName !== "transform") return;
                if (typeof callback === "function") callback();
            };
        };

        this._onTransitionEnd(() => {
            if (typeof onOpen === "function") onOpen();
        });

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

        this._onTransitionEnd(() => {
            if (this._backdrop && destroy) {
                this._backdrop.remove();
                this._backdrop = null;
                this._modalFooter = null;
            }

            // Enable scrolling
            document.body.classList.remove("no-scroll");
            document.body.style.padding = "";

            if (typeof onClose === "function") onClose();
        });
    };

    this.destroy = () => {
        this.close(true);
    };
}

const modal1 = new Modal({
    templateId: `modal-1`,
    destroyOnClose: false,
    onOpen: () => {
        console.log("Modal 1 Opened");
    },
    onClose: () => {
        console.log("Modal 1 Closed");
    },
});

$("#open-modal-1").onclick = () => {
    modal1.open();
};
const modal2 = new Modal({
    templateId: `modal-2`,
    cssClass: ["class1", "class2", "class3"],
    onOpen: () => {
        console.log("Modal 2 Opened");
    },
    onClose: () => {
        console.log("Modal 2 Closed");
    },
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

const modal3 = new Modal({
    templateId: `modal-3`,
    footer: true,
    onOpen: () => {
        console.log("Modal 3 Opened");
    },
    onClose: () => {
        console.log("Modal 3 Closed");
    },
});
modal3.setFooterContent('<h2> Footer Content </h2>');
modal3.open();
modal3.setFooterContent('<h2> Footer Content new </h2>');