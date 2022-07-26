import { LightningElement } from 'lwc';

import MapPinIcon from '@salesforce/resourceUrl/MapPinIcon';
import EmailIcon from '@salesforce/resourceUrl/EmailIcon';
import PhoneIcon from '@salesforce/resourceUrl/PhoneIcon';

export default class BrandFooter extends LightningElement {

    phoneIcon = PhoneIcon;
    emailIcon = EmailIcon;
    mapPinIcon = MapPinIcon;
}