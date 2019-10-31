import Node from "./SceneNode.js";

export default class AstronomicalBody {
  constructor (info)
  {
    /*two nodes, an orbit and a planet*/
    this.orbit  = new Node();
    if (info.parent)
      this.orbit.setParent(info.parent.orbit);
    this.orbit.localMatrix = info.orbitMatrix;
    
    this.body = new Node();
    this.body.setParent(this.orbit);
    this.body.localMatrix = info.bodyMatrix;

    this.drawInfo = info.drawInfo;
  }


}
