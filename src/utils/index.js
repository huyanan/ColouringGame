import { v4 as uuidv4 } from 'uuid';
export default {
    id: 0,
    uuid () {
        return uuidv4();
    },
    getIncreamentId () {
        return ++this.id
    },
    updateIdLib (id) {
        if (this.id < id) {
            this.id = id;
        }
    }
};