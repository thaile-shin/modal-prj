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

function Modal () {
    this.openModal = (options = {}) => {
        const {templateId, allowBackdropClose = true} = options;
        const template = $(`#${templateId}`);
        if(!template) {
            console.error(`${templateId} does not exist`);
            return;
        };

        // Create modal elements
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';

        const container = document.createElement('div');
        container.className = 'modal-container';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const content = template.content.cloneNode(true);

        // Append content and elements
        modalContent.append(content);
        container.append(closeBtn, modalContent);
        backdrop.append(container);
        document.body.append(backdrop);

        setTimeout(() => {
            backdrop.classList.add('show');
        },0);

        // Attach event listener
        closeBtn.addEventListener('click',() => {
            this.closeModal(backdrop);
        });

        if (allowBackdropClose) {
            backdrop.onclick = (e) => {
                if(e.target === backdrop) {
                    this.closeModal(backdrop);
                }
            };
        }
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Escape') {
                this.closeModal(backdrop);
            }
        });

        // Disable scrolling
        document.body.classList.add('no-scroll');
        document.body.style.paddingRight = getScrollbarWidth + 'px';
        return backdrop;
    };
    this.closeModal = (modalElement) => {
        modalElement.classList.remove('show');
        modalElement.ontransitionend = () => {
            modalElement.remove();

            // Enable scrolling
            document.body.classList.remove('no-scroll');
        };
    }
};

const modal = new Modal;

$('#open-modal-1').onclick = () => {
    modal.openModal({
        templateId: `modal-1`,
    });
}

$('#open-modal-2').onclick = () => {
    const modalElement = modal.openModal({
        templateId: `modal-2`,
        allowBackdropClose: false,
    });
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
}

// Caculate scrollbar width
function getScrollbarWidth () {
    const div = document.createElement('div');
    Object.assign(div.style,{
        overflow: 'scroll',
        position: 'absolute',
        top: '-9999px',
    })

    document.body.appendChild(div);

    const scrollbarWidth = div.offsetWidth - div.clientWidth;

    document.body.removeChild(div);

    return scrollbarWidth;
};
