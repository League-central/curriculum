function getChildById(parent, id){
	var c = parent.childNodes;
	for(var i = 0; i < c.length; i++){
		if(c[i].id == id){	
			return c[i];
		}
	}
	return null;
}