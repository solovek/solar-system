export default class SceneNode {
  constructor ()
  {
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
  }

  setParent (parent)
  {
    // remove us from our parent
    if (this.parent) {
      var ndx = this.parent.children.indexOf(this);
      if (ndx >= 0) {
	this.parent.children.splice(ndx, 1);
      }
    }
    
    // Add us to our new parent
    if (parent) {
      parent.children.push(this);
    }
    
    this.parent = parent;
  }

  updateWorldMatrix (matrix)
  {
    if (matrix) {
      // a matrix was passed in so do the math
      m4.multiply(matrix, this.localMatrix, this.worldMatrix);
    } else {
      // no matrix was passed in so just copy.
      m4.copy(this.localMatrix, this.worldMatrix);
    }
    
    // now process all the children
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child) {
      child.updateWorldMatrix(worldMatrix);
    });
  }
}
