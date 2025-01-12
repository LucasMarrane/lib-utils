import * as MapExtension from './Map.extension';
import * as WindowExtension from './Window.extension';
import * as ErrorExtension from './Error.extension';

export class Extensions {
    /**
     * Adds the Map extension to the Map class, allowing for additional functionality,
     * like deleting multiple keys at once, setting multiple key-value pairs at once, and converting the Map to an object.
     *
     */
    public static setMapExtension() {
        MapExtension.setMapExtension();
        return Extensions;
    }

    /**
     *  Adds the Logger extension to the window object, allowing for logging messages to the console and storing them in an array in window object.
     */
    public static setLogerExtension() {
        WindowExtension.setLoggerExtension();
        return Extensions;
    }

    /**
     *  Adds the Error extension to the Error class, allowing for logging errors to the console and storing them in an array in window object.
     */
    public static setErrorExtension() {
        ErrorExtension.setErrorExtension();
        return Extensions;
    }

    /**
     *  Adds the Console Log extension to the console object, allowing for logging messages to the console and storing them in an array in window object.
     *
     */

    public static setConsoleLogExtension() {
        WindowExtension.setConsoleLogExtension();
        return Extensions;
    }

    /**
     *  Adds the Download extension to the window object, allowing for downloading files from the browser.
     */
    public static setDownloadExtension() {
        WindowExtension.setDownloadExtension();
        return Extensions;
    }
}
