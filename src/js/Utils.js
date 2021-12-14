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
}


export default Utils;
