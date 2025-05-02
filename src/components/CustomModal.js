import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function CustomModal({ title, bodyText, confirmButtonText, onSave, show, onHide }) {

    const handleSave = () => {
        if (onSave) {
            onSave();
        }
        onHide();
    };
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>{bodyText}</Modal.Body>

            <Modal.Footer>
                <Button variant="primary" style={{ backgroundColor: "#000842" }}  onClick={onHide}>
                    Volver
                </Button>
                <Button variant="danger" onClick={handleSave}>
                    {confirmButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CustomModal;