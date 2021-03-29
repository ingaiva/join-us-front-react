import React , { useContext } from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useState } from "react";

import authHeader from "../../auth-header";
import { AppContext } from "../../index";
import SweetAlert from "sweetalert2";

//Envoyer données

function CreateOffer() {
  const context = useContext(AppContext);
  /* VARIABLES  Modal */
  const [showModal, setShowModal] = useState(false);
  const [adminInput, setAdminInput] = useState(getInput());

  //Envoyer données Fetch
  async function sendInput(e) {
    e.preventDefault();
    const options = {
      method: "POST",
      body: JSON.stringify(adminInput),
      headers: authHeader(),
    };

    let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/admin/creer-offre";
    const response = await fetch(url, options);
    const inputData = await response.json();
    
    if (inputData?.success) {
      context.setCatalogue([...context.catalogue, inputData.data]);
    }
    setShowModal(false);
  }
  // Afficher Modal
  function openModal(data) {
    setShowModal(true);
    setAdminInput(data);
  }

  //Mise a jour Input
  function onChange(ev) {
    const value=ev.target.type === 'checkbox' ?  ev.target.checked :  ev.target.value;
    setAdminInput({ ...adminInput, [ev.target.name]: value });
  }

  //Offre par default
  function getInput() {
    return {
      titre: "",
      description: "",
      lienExterne: "",
      dateFin: null,
      statut: "active",
      prix: 0,
      devise:'',
      virtuel: true,
      pays: "France",      
    };
  }

  //Formulaire
  function renderAdminInput() {
    return (
      <Form>
        <Row form>
          <Col md={8}>
            <FormGroup>
              <Label for="titre">Titre</Label>
              <Input
                type="text"
                name="titre"
                id="titre"
                placeholder="Votre titre.."
                onChange={onChange}
                value={adminInput.titre}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="dateFin">Date de fin</Label>
              <Input
                type="date"
                name="dateFin"
                id="dateFin"
                onChange={onChange}
                value={adminInput.dateFin}
                required
              />
            </FormGroup>
          </Col>
        </Row>
        <Col md={12}>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              placeholder="Description..."
              onChange={onChange}
              value={adminInput.description}
            />
          </FormGroup>
        </Col>
        <Row from>
          <Col md={12}>
            <FormGroup>
              <Label for="lienExterne">Lien</Label>
              <Input
                type="text"
                name="lienExterne"
                id="lienExterne"
                placeholder="Votre lien..."
                onChange={onChange}
                value={adminInput.lienExterne}
              />
            </FormGroup>
          </Col>
        </Row>{" "}
        <Row form>
          <Col md={4}>
            <FormGroup>
              <Label for="nom">Prix</Label>
              <Input
                type="text"
                name="prix"
                id="prix"
                placeholder="prix"
                onChange={onChange}
                value={adminInput.prix}
                required
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="devise">Devise</Label>
              <Input
                type="select"
                name="devise"
                id="devise"
                placeholder="devise"
                onChange={onChange}
                value={adminInput.devise}
                required
              >
                <option>XRP</option>
                <option selected>EUR</option>
                <option>RP</option>
              </Input>
            </FormGroup>
          </Col>

          <Col md={4}>
            <FormGroup>
              <Label for="pays">Pays</Label>
              <Input
                type="text"
                name="pays"
                id="pays"
                placeholder="pays"
                onChange={onChange}
                value={adminInput.pays}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row form>
          <Col md={5} />
          <Col md={7}>
            <FormGroup>
              <Label for="virtuel">
                <Input
                  type="checkbox"
                  name="virtuel"
                  id="virtuel"
                  placeholder="virtuel"
                  onChange={onChange}
                  defaultChecked={true}
                />
                {"  "}
                Virtuel
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Col md={12}>
          <FormGroup>
            <Label for="statut">Statut</Label>
            <Input
              type="select"
              name="statut"
              id="statut"
              placeholder="statut"
              onChange={onChange}
              value={adminInput.statut}
              required
            >
              <option>draft</option>
              <option selected>active</option>
              <option>disabled</option>
              <option>expired</option>
              <option>preview</option>
            </Input>
          </FormGroup>
        </Col>
      </Form>
    );
  }

  function renderModal() {
    return (
      <Modal isOpen={showModal}>
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          {" "}
          Ajoutez votre offre
        </ModalHeader>
        <ModalBody>{renderAdminInput()}</ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button color="info" onClick={sendInput}>
            Valider
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <Row className="mb-3">
      <Col sm="12" lg="12" xl="12">
        <a class="btn btn-info btn-lg" href="#" onClick={() => openModal(true)}>
          <span class="fa fa-edit"></span> Créer une offre
        </a>
        {renderModal()}
      </Col>
    </Row>
  );
}

export default CreateOffer;
