class Utils {


  constructor() {}


  static fetchTemplate(url) {
    return new Promise((resolve, reject) => {
			fetch(url).then(data => {
        data.text().then(html => {
          resolve(document.createRange().createContextualFragment(html));
        }).catch(reject);
			}).catch(reject);
		});
  }


  static stripDom(html){
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }


}


export default Utils;
