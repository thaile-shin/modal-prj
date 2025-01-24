const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

{/* <div class="modal-backdrop">
    <div class="modal-container">
        <button class="modal-close">&times;</button>
        <div class="modal-content">
            <p>
                .....
            </p>
        </div>
    </div>
</div> */}

function Modal (options = {}) {
    const {templateId, closeMethod=['button', 'overlay', 'escape']} = options;
    const template = $(`#${templateId}`);
    if(!template) {
        console.error(`${templateId} does not exist`);
        return;
    };

    // Caculate scrollbar width
    function getScrollbarWidth () {
        if(getScrollbarWidth.value) return getScrollbarWidth.value;

        const div = document.createElement('div');
        Object.assign(div.style,{
            overflow: 'scroll',
            position: 'absolute',
            top: '-9999px',
        });
        document.body.appendChild(div);

        const scrollbarWidth = div.offsetWidth - div.clientWidth;

        document.body.removeChild(div);

        getScrollbarWidth.value = scrollbarWidth

        return scrollbarWidth;
    };

    this._allowButtonClose = closeMethod.includes('button');
    this._allowBackdropClose = closeMethod.includes('overlay');
    this._allowEscapeClose = closeMethod.includes('escape');

    this.open = () => {
        // Create modal elements
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';

        const container = document.createElement('div');
        container.className = 'modal-container';

        if(this._allowButtonClose) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '&times;';

            container.append(closeBtn);
            closeBtn.addEventListener('click',() => {
                this.close(backdrop);
            });
        }

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const content = template.content.cloneNode(true);

        // Append content and elements
        modalContent.append(content);
        container.append(modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add('show');
        },0);

        // Attach event listener
        if (this._allowBackdropClose) {
            backdrop.onclick = (e) => {
                if(e.target === backdrop) {
                    this.close(backdrop);
                }
            };
        };
        if(this._allowEscapeClose) {
            document.addEventListener('keydown', (e) => {
                if(e.key === 'Escape') {
                    this.close(backdrop);
                }
            });
        }

        // Disable scrolling
        document.body.classList.add('no-scroll');
        document.body.style.paddingRight = getScrollbarWidth() + 'px';
        return backdrop;
    };
    this.close = (modalElement) => {
        modalElement.classList.remove('show');
        modalElement.ontransitionend = () => {
            modalElement.remove();

            // Enable scrolling
            document.body.classList.remove('no-scroll');
        };
    }
};

const modal1 = new Modal({
    templateId: `modal-1`,
});

$('#open-modal-1').onclick = () => {
    modal1.open();
}
const modal2 = new Modal({
    templateId: `modal-2`,
})
$('#open-modal-2').onclick = () => {
    const modalElement = modal2.open();
    // get elements in Modal
    const form = modalElement.querySelector('#login-form');
    if (form) {
        form.onsubmit = e => {
            e.preventDefault();
            const formData = {
                email: $('#email').value.trim(),
                password: $('#password').value.trim()
            }
        }
    }
};
