import { StorageManager } from "@slynova/flydrive"
const storage = new StorageManager({
    default: "local", disks: {
        local: {
            driver:"local",
            config:{
                root: process.cwd()
            }
        }
    }
});

const disk = storage.disk('local');

export default disk;