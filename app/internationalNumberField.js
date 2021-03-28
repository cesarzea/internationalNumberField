/***
 * @author  Cesar Pedro Zea Gomez <cesarzea@jaunesistemas.com>
 *          https://www.cesarzea.com
 *          Contact me for freelance jobs, suggestions, doubts, queries, etc.
 *
 * @title   Ext.field.Number internationalization
 *
 * Sencha Fiddle: https://fiddle.sencha.com/#view/editor&fiddle/3coe
 * GitHub repo  : https://github.com/cesarzea/internationalNumberField
 *
 * This redefinition of Ext.field.Number adds the property
 * showThousandSeparator, whose default value is true, which will establish
 * whether or not you want the component to show the thousands separators in
 * the number.
 *
 * Also using the already existing properties [decimals] and [decimalSeparator]
 * allows to display and edit the numbers according to the following two
 * international formats:
 *
 * Europe format   :  1.124.543,00
 * American Format :  1,124,543.00
 *
 * Regardless of the format chosen, the getValue () and setValue () methods will
 * continue to accept and return values in the standard format that uses the
 * period as a decimal point.
 *
 */
Ext.override(Ext.field.Number, {

    config: {

        /**
         * @cfg {String} decimalSeparator
         * Character(s) to allow as the decimal separator.
         * Defaults to {@link Ext.util.Format#decimalSeparator decimalSeparator}.
         * @since 7.0 and overrided now.
         *
         * Asigned by that override to the default system value.
         */
        decimalSeparator: Ext.util.Format.decimalSeparator,

        /**
         * @cfg {String} thousandSeparator
         * Character(s) to allow as the thosuands separator.
         * Defaults to {@link Ext.util.Format#thousandSeparator thousandSeparator}.
         *
         */
        thousandSeparator: Ext.util.Format.thousandSeparator,

        /**
         * @cfg {Boolean} showThousandSeparator
         * 'true' to show the thousands separator in the value.
         *
         */
        showThousandSeparator: true
    },

    /**
     * Constructor override to define the new properties default values.
     *
     * @param config
     */
    constructor: function (config) {

        if (config.decimalSeparator === undefined)
            config.decimalSeparator = Ext.util.Format.decimalSeparator;

        config.thousandSeparator = config.decimalSeparator === '.' ? ',' : '.';

        Ext.apply(this, config, this.config);

        this.callParent([config]);

    },

    /**
     * Initializa function override.
     *
     * @param c
     */
    initialize: function (c) {

        // Set the text aligment to right.
        this.setTextAlign('right');
        this.updateDecimals();
        this.syncDecimalValidator();

        this.callParent();

    },

    /**
     * applyInputValue override.
     *
     * @param value
     * @returns {any}
     */
    applyInputValue: function (value) {

        // Remove the thousands separators
        if (value && Ext.isString(value) && this.thousandSeparator) {
            value = value.replaceAll(this.thousandSeparator, '');
        }


        // Change the configured decimal separator for the system decimal separator.
        if (value && Ext.isString(value) && this.getDecimalSeparator())
            value = value.replace(this.getDecimalSeparator(), Ext.util.Format.decimalSeparator);

        // Fix the number of decimals and set the value.
        if (value && Ext.isNumeric(value)) {

            value = Ext.Number.toFixed(Ext.Number.parseFloat(value), this.getDecimals());
            this.setValue(Ext.Number.parseFloat(value));
        }

        this.callParent([value]);

        //
        // Formatting the number.
        //
        let zeroChar = this.getTrim() ? '#' : '0';
        let format = '0';

        if (this.getShowThousandSeparator())
            format = zeroChar + ',' + Ext.String.repeat(zeroChar, 3);

        if (this.getDecimals()) {
            format += '.' + Ext.String.repeat(zeroChar, this.getDecimals());
        }

        let v = this.getValue();

        let tsOld = Ext.util.Format.thousandSeparator;
        let dsOld = Ext.util.Format.decimalSeparator;

        // Save the system format status
        Ext.util.Format.thousandSeparator = this.thousandSeparator;
        Ext.util.Format.decimalSeparator = this.getDecimalSeparator();

        if (v !== null) {
            v = Ext.util.Format.number(v, format);

            //Fix the number of decimals
            if (this.getDecimals()) {
                let p = v.indexOf(this.getDecimalSeparator());
                if (p === -1) {
                    v = v + this.getDecimalSeparator() + Ext.String.repeat('0', this.getDecimals())
                } else {
                    v = v + Ext.String.repeat('0', this.getDecimals() - (v.length - p - 1));
                }
            }

            // Set the formatted string to the input element value
            let inputElement = this.inputElement.dom;
            inputElement.value = v;
        }

        // Restore the system format status
        Ext.util.Format.thousandSeparator = tsOld;
        Ext.util.Format.decimalSeparator = dsOld;

        return v;
    },

    /**
     * applyValue override.
     *
     * @param value
     * @param oldValue
     * @returns {*}
     */
    applyValue: function (value, oldValue) {

        this.updateDecimals();
        this.syncDecimalValidator();

        if (value && typeof value === 'string') {

            if (this.getDecimalSeparator() === ',')
                value = value.replaceAll('.', ',');

            value = this.parseValue(value);
            if (value === null) {
                return;
            }
        }

        return this.transformValue(this.callParent([
            value,
            oldValue
        ]));
    },

    privates: {

        /**
         * calculateNewValue override.
         *
         * @param text
         * @returns {string}
         */
        calculateNewValue: function (text) {

            var me = this,
                textSelection = me.getTextSelection(),
                raw = this.inputElement.dom.value; //= me.getInputValue();

            raw = raw.replaceAll(this.thousandSeparator, '');

            // Characters are selected, replace them.
            if (textSelection[1]) {
                raw = raw.substr(0, textSelection[0]) + text + raw.substr(textSelection[1]);
            } else {
                // No characters are selected, just insert at caret.
                raw = Ext.String.insert(raw, text, me.getCaretPos());
            }

            return raw;
        },

        /**
         * syncDecimalValidator override.
         */
        syncDecimalValidator: function () {

            var me = this,
                separator = me.getDecimalSeparator();

            me.setParseValidator(
                Ext.create('Ext.data.validator.Number', {
                    decimalSeparator: separator,
                    thousandSeparator: this.thousandSeparator
                })
            );

            me.validate();
        }

    }

})
