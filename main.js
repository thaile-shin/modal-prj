const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.elements = [];

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
    this._getScrollbarWidth = () => {
        if(this._getScrollbarWidth) return this._getScrollbarWidth;
        const div = document.createElement("div");
        Object.assign(div.style, {
            overflow: "scroll",
            position: "absolute",
            top: "-9999px",
        });
        document.body.appendChild(div);

        this._getScrollbarWidth = div.offsetWidth - div.clientWidth;

        document.body.removeChild(div);

        return this._getScrollbarWidth;
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
            const closeBtn = this._createButton("&times;", "modal-close", this.close);
            container.append(closeBtn);
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

            // if (this._footerContent) {
            //     this._modalFooter.innerHTML = this._footerContent;
            // }
            this._renderFooterContent();
            this._renderFooterButtons ();

            container.append(this._modalFooter);
        }

        this._backdrop.append(container);
        document.body.append(this._backdrop);
    };

    this.setFooterContent = (html) => {
        this._footerContent = html;
        this._renderFooterContent();
    };

    this._footerButtons = [];
    this.addFooterBtn = (title, cssClass, callbackFn) => {
        const button = this._createButton(title, cssClass, callbackFn);
        this._footerButtons.push(button);
        this._renderFooterButtons ();
    };

    this._renderFooterContent = () => {
        if (this._modalFooter && this._footerContent) {
            this._modalFooter.innerHTML = this._footerContent;
        }
    }

    this._renderFooterButtons = () => {
        if (this._modalFooter) {
            this._footerButtons.forEach((button) => {
                this._modalFooter.append(button);
            });
        };
    }

    this._createButton = (title, cssClass, callbackFn) => {
        const button = document.createElement("button");
        button.className = cssClass;
        button.innerHTML = title;
        button.onclick = callbackFn;

        return button;
    }

    this.open = () => {
        Modal.elements.push(this);

        if (!this._backdrop) {
            this.build();
        }

        this._onTransitionEnd = (callback) => {
            this._backdrop.ontransitionend = (e) => {
                if (e.propertyName !== "transform") return;
                if (typeof callback === "function") callback();
            };
        };

        this._onTransitionEnd(onOpen);

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

        this._handleEscapeKey = (e) => {
            const lastModal = Modal.elements[Modal.elements.length - 1];
            if (e.key === "Escape" && this === lastModal) {
                this.close();
            }
        };

        if (this._allowEscapeClose) {
            document.addEventListener("keydown", this._handleEscapeKey);
        }

        // Disable scrolling
        document.body.classList.add("no-scroll");
        document.body.style.paddingRight = this._getScrollbarWidth() + "px";
        return this._backdrop;
    };
    this.close = (destroy = destroyOnClose) => {
        Modal.elements.pop(this);

        this._backdrop.classList.remove("show");

        if (this._allowEscapeClose) {
            document.removeEventListener("keydown", this._handleEscapeKey);
        }

        this._onTransitionEnd(() => {
            if (this._backdrop && destroy) {
                this._backdrop.remove();
                this._backdrop = null;
                this._modalFooter = null;
            }

            // Enable scrolling
            if (!Modal.elements.length) {
                document.body.classList.remove("no-scroll");
                document.body.style.padding = "";
            }

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
    closeMethod: [],
    footer: true,
    onOpen: () => {
        console.log("Modal 3 Opened");
    },
    onClose: () => {
        console.log("Modal 3 Closed");
    },
});
// modal3.setFooterContent('<h2> Footer Content </h2>');
// modal3.setFooterContent('<h2> Footer Content new </h2>');

modal3.addFooterBtn("Danger", "modal-btn danger pull-left", (e) => {
    alert("Danger clicked");
});

modal3.addFooterBtn("Cancel", "modal-btn", (e) => {
    modal3.close();
});

modal3.addFooterBtn("<span>Agree</span>", "modal-btn primary", (e) => {
    // Do something
    modal3.close();
});
$("#open-modal-3").onclick = () => {
    modal3.open();
};
