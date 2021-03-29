import React, { Fragment, useContext } from "react";
import Breadcrumb from "../common/breadcrumb/breadcrumb";
import {
  Row,
  Col,
  Card,
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
import { useState, useEffect } from "react";

import authHeader from "../../auth-header";
import { AppContext } from "../../index";
import SweetAlert from "sweetalert2";
//import swal from 'sweetalert'

function Catalogue() {
  /* VARIABLES spéciales Modal */
  const [showModalCmd, setShowModalCmd] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [userInput, setUserInput] = useState(getUserInputVide());
  const [showModalOffreUpdate, setShowModalOffreUpdate] = useState(false);

  const context = useContext(AppContext);
  // Lors du premier affichage du composant App //
  useEffect(getCatalogueCollections, []);

  // Récupèration des données du catalogue //

  async function getCatalogueCollections() {
    const options = {
      method: "GET",
      headers: authHeader(),
    };

    let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/catalogue";
    const response = await fetch(url, options);
    const catalogueData = await response.json();
    context.setCatalogue(catalogueData.data);
  }

  function getUserInputVide() {
    return {
      nom: "",
      prenom: "",
      address: "",
      address2: "",
      cp: "",
      ville: "",
      pays: "France",
      email: "",
    };
  }
  function onChange(ev) {
    setUserInput({ ...userInput, [ev.target.name]: ev.target.value });
  }

  function checkUserInput() {
    if (userInput && selectedOffre) {
      if (selectedOffre.virtuel && !userInput.email) return false;
      else if (!selectedOffre.virtuel) {
        if (
          !userInput.nom ||
          !userInput.address ||
          !userInput.ville ||
          !userInput.cp
        ) {
          return false;
        }
      }
      return true;
    }
  }

  //Fonction refresh

  async function validerCmd() {
    const refreshPage = () => {
      window.location.reload();
    };
    if (userInput && selectedOffre) {
      if (checkUserInput()) {
        let objPost = { offre: selectedOffre, userInput: userInput };
        var options = {
          method: "POST",
          body: JSON.stringify(objPost),
          headers: authHeader(),
        };
        let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/user/creer-cmd"; ///transactions
        const response = await fetch(url, options);
        const responseData = await response.json();
        if (responseData && responseData?.success) {
          SweetAlert.fire({ title: "Votre commande est prise en compte!" });
          refreshPage();
        } else {
          SweetAlert.fire({ title: "Une erreur s'est produite!" });
        }
        setSelectedOffre(null);
        setShowModalCmd(false);
      } else {
        SweetAlert.fire({ title: "Les données sont manquantes" });
      }
    }
  }

  function onCreateCmdClicked(offre) {
    setSelectedOffre(offre);
    setShowModalCmd(true);
  }

  async function onDeleteOffreClicked(offre) {
    SweetAlert.fire({
      title: "Etes-vous sûr de vouloir supprimer cette offre?",
      showCancelButton: true,
      confirmButtonText: `Supprimer`,
      cancelButtonText: `Annuler`,
      icon: "warning",
    }).then(async (result) => {
      if (result.isConfirmed) {
        var options = {
          method: "POST",
          body: JSON.stringify(offre),
          headers: authHeader(),
        };
        let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/admin/supprimer-offre";
        const response = await fetch(url, options);
        const responseData = await response.json();
        if (responseData && responseData?.success) {
          context.removeOffre(offre);
        } else {
          SweetAlert.fire({ title: "Une erreur s'est produite!" });
        }
      } else if (result.isDismissed) {
        console.log("delete cancelled");
      }
    });
  }
  //on affiche le modal pour update
  function onUpdateOffreClicked(offre) {
    setSelectedOffre(offre);
    setShowModalOffreUpdate(true);
  }
  //validation et enregistrement des modifications
  async function validerOffreUpdate() {
    try {
      var options = {
        method: "PUT",
        body: JSON.stringify(selectedOffre),
        headers: authHeader(),
      };
      let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/admin/modifer-offre";
      const response = await fetch(url, options);
      const responseData = await response.json();
      if (responseData && responseData?.success && responseData?.data) {
        context.updateOffre(responseData.data);
      } else {
        SweetAlert.fire({ title: "Une erreur s'est produite!" });
      }
    } catch (error) {
      SweetAlert.fire({ title: "Une erreur s'est produite!" });
    }
    setSelectedOffre(null);
    setShowModalOffreUpdate(false);
  }

  function renderOffre(offre) {
    let classNameCard = "card card-g-dark";
    let textClassName = "text-info";
    let btnStyle = {
      radius: "80%",
      maxWidth: "100%",
      textAlign: "center",
      margin: "2px 5px",
    };
    let btn = "";
    let btnUpdate = "";
    let btnDelete = "";
    let solde = 0;
    if (context?.user?.solde) {
      const deviseIndex = context?.user?.solde.findIndex(
        (el) => el.currency === offre.devise
      );
      if (deviseIndex > -1) {
        solde = context.user.solde[deviseIndex].solde;
      }
     
    }  

    if (solde >= offre.prix && context?.user && context.isUser()) {
      classNameCard = "card ";
      if (offre.devise === "EUR") classNameCard += "card-g-secondary";
      else if (offre.devise === "XRP") classNameCard += "card-g-success";
      else if (offre.devise === "RP") classNameCard += "card-g-info";
      textClassName = "text-white";
      btn = (
        <Button
          style={btnStyle}
          color="info"
          onClick={() => onCreateCmdClicked(offre)}
        >
          Commander
        </Button>
      );
    }
    if (context?.user && context.isAdmin()) {
      btnUpdate = (
        <Button
          style={btnStyle}
          color="primary"
          className="py-1 px-1"
          onClick={() => onUpdateOffreClicked(offre)}
        >
          Modifier
        </Button>
      );
      btnDelete = (
        <Button
          style={btnStyle}
          color="warning"
          className="py-1 px-1"
          onClick={() => onDeleteOffreClicked(offre)}
        >
          Supprimer
        </Button>
      );
    }
    //
    return (
      <Card
        className={classNameCard}
        style={{ padding: 20, margin: "1%", width: "30%" }}
      >
        <div className="d-flex justify-content-between">
          <h3
            className={textClassName}
            style={{ fontSize: 20, fontWeight: 800 }}
          >
            {offre.titre}
          </h3>
          <h3
            className={textClassName}
            style={{ fontSize: 20, fontWeight: 800 }}
          >
            {offre.prix + " " + offre.devise}
          </h3>
        </div>
        <div className="d-flex">
          <div>
            <p className={textClassName}>{offre.description}</p>
            <a className={textClassName} href={offre.lienExterne} target="_blank">
              {offre.lienExterne}
            </a>
          </div>         
              <img
               
                src={require("../../assets/images/product/gift.png")}
                alt=""
                style={{maxHeight:'100px'}}
              />            
        </div>
        <div className="d-lg-flex justify-content-center">
          {btnDelete}
          {btnUpdate}
          {btn}
        </div>
      </Card>
    );
  }

  function renderOffres() {
    if (context.catalogue) {
      return context.catalogue.map((offre) => renderOffre(offre));
    }
  }

  function renderModal() {
    return (
      <Modal isOpen={showModalCmd}>
        <ModalHeader toggle={() => setShowModalCmd(!showModalCmd)}>
          {" "}
          Finalisez votre commande
        </ModalHeader>
        <ModalBody>{renderSelectedOffre()}</ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={() => setShowModalCmd(false)}>
            Annuler
          </Button>
          <Button color="info" onClick={validerCmd}>
            Commander
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  function renderModalOffreUpdate() {
    return (
      <Modal isOpen={showModalOffreUpdate}>
        <ModalHeader
          toggle={() => setShowModalOffreUpdate(!showModalOffreUpdate)}
        >
          Mise à jour
        </ModalHeader>
        <ModalBody>{renderSelectedOffreToUpdate()}</ModalBody>
        <ModalFooter>
          <Button
            color="warning"
            onClick={() => setShowModalOffreUpdate(false)}
          >
            Annuler
          </Button>
          <Button color="info" onClick={validerOffreUpdate}>
            Valider
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  function renderUserInput() {
    if (selectedOffre) {
      if (selectedOffre.virtuel) {
        return (
          <Form>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                onChange={onChange}
                value={userInput.email}
                required
              />
            </FormGroup>
          </Form>
        );
      } else {
        return (
          <Form>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="nom">Nom</Label>
                  <Input
                    type="text"
                    name="nom"
                    id="nom"
                    placeholder="Votre nom"
                    onChange={onChange}
                    value={userInput.nom}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="prenom">Prénom</Label>
                  <Input
                    type="text"
                    name="prenom"
                    id="prenom"
                    placeholder="Votre prénom"
                    onChange={onChange}
                    value={userInput.prenom}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="address">Adresse</Label>
              <Input
                type="text"
                name="address"
                id="address"
                placeholder="Adresse"
                onChange={onChange}
                value={userInput.address}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="address2">Complément d'adresse</Label>
              <Input
                type="text"
                name="address2"
                id="address2"
                placeholder="Complément d'adresse"
                onChange={onChange}
                value={userInput.address2}
              />
            </FormGroup>

            <Row form>
              <Col md={3}>
                <FormGroup>
                  <Label for="nom">Code postal</Label>
                  <Input
                    type="text"
                    name="cp"
                    id="cp"
                    placeholder="cp"
                    onChange={onChange}
                    value={userInput.cp}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="ville">Ville</Label>
                  <Input
                    type="text"
                    name="ville"
                    id="ville"
                    placeholder="Ville"
                    onChange={onChange}
                    value={userInput.ville}
                    required
                  />
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
                    value={userInput.pays}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
        );
      }
    }
  }

  function renderSelectedOffre() {
    if (selectedOffre) {
      let textClassName = "text-info";
      return (
        <div>
          <div className="d-flex justify-content-between">
            <h6 className={textClassName}>{selectedOffre.titre}</h6>
            <h3 className={textClassName}>
              {selectedOffre.prix + " " + selectedOffre.devise}
            </h3>
          </div>
          <h5 className={textClassName}>{selectedOffre.description}</h5>
          {renderUserInput()}
        </div>
      );
    }
  }
  function onChangeOffre(ev) {
    const value =
      ev.target.type === "checkbox" ? ev.target.checked : ev.target.value;
    setSelectedOffre({ ...selectedOffre, [ev.target.name]: value });
  }
  function renderSelectedOffreToUpdate() {
    if (selectedOffre) {
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
                  onChange={onChangeOffre}
                  value={selectedOffre.titre}
                  required
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
                  onChange={onChangeOffre}
                  value={selectedOffre.dateFin}
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
                onChange={onChangeOffre}
                value={selectedOffre.description}
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
                  onChange={onChangeOffre}
                  value={selectedOffre.lienExterne}
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
                  onChange={onChangeOffre}
                  value={selectedOffre.prix}
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
                  onChange={onChangeOffre}
                  value={selectedOffre.devise}
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
                  onChange={onChangeOffre}
                  value={selectedOffre.pays}
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
                    onChange={onChangeOffre}
                    checked={selectedOffre.virtuel}
                  />
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
                onChange={onChangeOffre}
                value={selectedOffre.statut}
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
  }

  // function renderAjoutOffre() {
  //   if (context?.user && context.isAdmin()) {
  //     return (
  //       <div className="d-flex justify-content-center flex-wrap my-3">
  //         <Button color="info">Ajouter une nouvelle offre</Button>
  //       </div>
  //     );
  //   }
  // }
  // Fonction d'affichage //
  function renderCatalogue() {
    if (context.catalogue) {
      return (
        <Fragment>
          <Breadcrumb parent="Default" title="Catalogue" />
          <div className="d-flex justify-content-center flex-wrap m-b-50">
            {renderOffres()}
          </div>
          {renderModal()}
          {renderModalOffreUpdate()}
        </Fragment>
      );
    }
  }

  {
    return <div>{renderCatalogue()}</div>;
  }
}
export default Catalogue;
