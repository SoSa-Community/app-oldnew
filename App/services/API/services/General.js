import { Client } from "../Client.js";
import { SoSaError } from '../entities/SoSaError';
import { Request } from '../core/Request';

export class GeneralService {

    /** @type {Client} */
    client = null;
    
    constructor(client) {
        this.client = client;
        this.provider = client.getProvider('content');
    }

    prepareUpload = (communityID) => {
        return (new Request(this.provider, 'content', 'prepareUpload', {community_id: communityID}, 'POST', true)).run().then((response) => response.data);
    };
    
    handleUpload = (community, file, xmlParser) => {
        return this.prepareUpload(community)
            .then(({requestInfo, post}) => {
                let formData = new FormData();
            
                for(let key in post) formData.append(key, post[key]);
                formData.append('file', file);
            
                return fetch(requestInfo.uploadURI, {
                    method: "POST",
                    body: formData,
                    cache: "no-store",
                    headers: {"Content-Type": "multipart/form-data"}
                })
                    .then((response) => response.text())
                    .then(this.client.xmlParser)
                    .then((parsedXML) => {
                        const {Error: error} = parsedXML;
                        console.debug(parsedXML);
    
                        if(error) throw new SoSaError(null, error);
                        const {PostResponse: {ETag, Key, Location}} = parsedXML;
                        
                        return({uris: Location, tag: ETag, uuid: Key});
                    });
                    
                    
            })
    }

}
