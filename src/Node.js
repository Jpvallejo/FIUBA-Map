function breakWords(string) {
  let broken = "";
  string.split(" ").forEach((element) => {
    if (element.length < 5) broken += " " + element;
    else broken += "\n" + element;
  });
  return broken.trim();
}

class Node {
  constructor(n) {
    this.nodeRef = this;
    Object.assign(this, { ...n });
    this.label = breakWords(n.materia);
    this.group = this.categoria;
    this.aprobada = false;
    this.nota = 0;
    this.habilitada = false;
    this.title = `Otorga ${this.creditos} créditos${
      this.requiere ? "\nRequiere " + this.requiere + " créditos" : ""
    }`;
    this.cuatri = -1;
    this.hidden =
      this.categoria !== "Materias Obligatorias" &&
      this.categoria !== "CBC" &&
      this.categoria !== "Fin de Carrera (Obligatorio)";
  }

  cursando(ctx) {
    const { network, nodes, getNode, cuatri, showLabels } = ctx;

    this.cuatri = cuatri;
    if (this.label.includes("[")) this.label = this.label.split("\n[")[0];
    if (showLabels && cuatri === 0) this.label += "\n[Cursando]";
    if (showLabels && cuatri === 1) this.label += "\n[En 1 cuatri]";
    if (showLabels && cuatri > 1) this.label += "\n[En " + cuatri + " cuatris]";

    this.group = this.getGrupo();
    nodes.update(this);
  }

  chequearNodosCred(ctx) {
    const { nodes, getNode } = ctx;
    const nodosCred = nodes.get({
      filter: (n) => n.requiere && !n.correlativas,
      fields: ["id"],
    });

    const totalCreditos = nodes
      .get({ filter: (n) => n.aprobada, fields: ["creditos"] })
      .reduce((acc, n) => {
        acc += n.creditos;
        return acc;
      }, 0);

    const res = [];
    nodosCred.forEach((n) => {
      const node = getNode(n.id);
      node.habilitada = totalCreditos >= node.requiere;
      node.group = node.getGrupo();
      res.push(node);
    });

    return res;
  }

  showLabel(ctx) {
    const { nodes, showLabel } = ctx;
    if (!showLabel && this.label.includes("["))
      this.label = this.label.split("\n[")[0];

    if (showLabel) {
      if (this.nota > 0) this.label += "\n[" + this.nota + "]";
      else if (this.nota === 0 && this.id !== "CBC")
        this.label += "\n[Equivalencia]";
      else if (this.nota === -1) {
        this.label += "\n[Final]";
      }
    }

    nodes.update(this);
  }

  aprobar(ctx) {
    const { network, nodes, getNode, nota, showLabels } = ctx;

    this.cuatri = -1;
    this.nota = nota;

    if (this.label.includes("[")) this.label = this.label.split("\n[")[0];
    if (nota > 0 && showLabels) this.label += "\n[" + this.nota + "]";
    if (showLabels && nota === 0 && this.id !== "CBC")
      this.label += "\n[Equivalencia]";
    if (nota === -1) {
      this.group = this.getGrupo();
      if (showLabels) this.label += "\n[Final]";
      nodes.update(this);
      return;
    }

    this.aprobada = true;
    this.group = this.getGrupo();
    nodes.update(this);
    const habilitadas = [];

    network.getConnectedNodes(this.id, "to").forEach((m) => {
      const nodem = getNode(m);
      if (nodem.isHabilitada(ctx)) {
        nodem.habilitada = true;
        nodem.group = nodem.getGrupo();
        habilitadas.push(nodem);
      }
    });

    nodes.update(habilitadas.concat(this.chequearNodosCred(ctx)));
  }

  isHabilitada(ctx) {
    const { network, nodes } = ctx;

    const from = network.getConnectedNodes(this.id, "from");

    let todoAprobado = true;
    for (let i = 0; i < from.length; i++) {
      const m = nodes.get(from[i]);
      todoAprobado &= m.aprobada;
    }
    const totalCreditos = nodes
      .get({ filter: (n) => n.aprobada, fields: ["creditos"] })
      .reduce((acc, n) => {
        acc += n.creditos;
        return acc;
      }, 0);

    if (this.requiere) todoAprobado &= totalCreditos >= this.requiere;
    return todoAprobado;
  }

  desaprobar(ctx) {
    const { network, nodes, getNode } = ctx;

    this.aprobada = false;
    this.cuatri = -1;
    this.nota = -2;
    if (this.label.includes("[")) this.label = this.label.split("\n[")[0];
    this.group = this.getGrupo();
    nodes.update(this);

    const deshabilitadas = [];

    network.getConnectedNodes(this.id, "to").forEach((m) => {
      const nodem = getNode(m);
      if (!nodem.isHabilitada(ctx)) {
        nodem.habilitada = false;
        nodem.group = nodem.getGrupo();
        deshabilitadas.push(nodem);
      }
    });

    nodes.update(deshabilitadas.concat(this.chequearNodosCred(ctx)));
  }

  getGrupo() {
    let grupoDefault = this.categoria;
    if (this.aprobada && this.nota >= 0) grupoDefault = "Aprobadas";
    else if (this.nota === -1) grupoDefault = "En Final";
    else if (this.cuatri === 0) grupoDefault = "Cursando";
    else if (this.cuatri > 0) grupoDefault = "A Cursar";
    else if (this.habilitada) grupoDefault = "Habilitadas";
    return grupoDefault;
  }
}

export default Node;
