const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Modal.elements = [];

function Modal(options = {}) {
    this.opt = Object.assign(
        {
            destroyOnClose: true,
            footer: false,
            cssClass: [],
            closeMethod: ["button", "overlay", "escape"],
        },
        options
    );

    this.template = $(`#${this.opt.templateId}`);
    if (!this.template) {
        console.error(`${this.opt.templateId} does not exist`);
        return;
    }

    const { closeMethod } = this.opt;
    this._allowButtonClose = closeMethod.includes("button");
    this._allowBackdropClose = closeMethod.includes("overlay");
    this._allowEscapeClose = closeMethod.includes("escape");

    this._footerButtons = [];

    this._handleEscapeKey = this._handleEscapeKey.bind(this);
}

Modal.prototype._build = function () {
    const content = this.template.content.cloneNode(true);

    // Create modal elements
    this._backdrop = document.createElement("div");
    this._backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    this.opt.cssClass.forEach((className) => {
        if (typeof className === "string") {
            container.classList.add(className);
        }
    });

    if (this._allowButtonClose) {
        const closeBtn = this._createButton("&times;", "modal-close", () =>
            this.close()
        );
        container.append(closeBtn);
    }

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Append content and elements
    modalContent.append(content);
    container.append(modalContent);

    if (this.opt.footer) {
        this._modalFooter = document.createElement("div");
        this._modalFooter.className = "modal-footer";

        this._renderFooterContent();
        this._renderFooterButtons();

        container.append(this._modalFooter);
    }

    this._backdrop.append(container);
    document.body.append(this._backdrop);
};

Modal.prototype.setFooterContent = function (html) {
    this._footerContent = html;
    this._renderFooterContent();
};

Modal.prototype.addFooterBtn = function (title, cssClass, callbackFn) {
    const button = this._createButton(title, cssClass, callbackFn);
    this._footerButtons.push(button);
    this._renderFooterButtons();
};

Modal.prototype._renderFooterContent = function () {
    if (this._modalFooter && this._footerContent) {
        this._modalFooter.innerHTML = this._footerContent;
    }
};

Modal.prototype._renderFooterButtons = function () {
    if (this._modalFooter) {
        this._footerButtons.forEach((button) => {
            this._modalFooter.append(button);
        });
    }
};

Modal.prototype._createButton = function (title, cssClass, callbackFn) {
    const button = document.createElement("button");
    button.className = cssClass;
    button.innerHTML = title;
    button.onclick = callbackFn;

    return button;
};

Modal.prototype.open = function () {
    Modal.elements.push(this);

    if (!this._backdrop) {
        this._build();
    }

    this._onTransitionEnd(this.opt.onOpen);

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
        document.addEventListener("keydown", this._handleEscapeKey);
    }

    // Disable scrolling
    document.body.classList.add("no-scroll");
    document.body.style.paddingRight = this._getScrollbarWidth() + "px";
    return this._backdrop;
};

Modal.prototype._handleEscapeKey = function (e) {
    const lastModal = Modal.elements[Modal.elements.length - 1];
    if (e.key === "Escape" && this === lastModal) {
        this.close();
    }
};

Modal.prototype._onTransitionEnd = function (callback) {
    this._backdrop.ontransitionend = (e) => {
        if (e.propertyName !== "transform") return;
        if (typeof callback === "function") callback();
    };
};

Modal.prototype.close = function (destroy = this.opt.destroyOnClose) {
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

        if (typeof this.opt.onClose === "function") this.opt.onClose();
    });
};

Modal.prototype.destroy = function () {
    this.close(true);
};

// Caculate scrollbar width
Modal.prototype._getScrollbarWidth = function () {
    if (this._getScrollbarWidth) return this._getScrollbarWidth;
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
};

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
