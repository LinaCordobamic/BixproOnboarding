import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';



admin.initializeApp(functions.config().firebase);

import {prospectosBixpro} from './tiendasBixpro/prospectoBixpro';
export {prospectosBixpro};