/***
 * @author  Cesar Pedro Zea Gomez <cesarzea@jaunesistemas.com>
 *          https://www.cesarzea.com
 *          Contact me for freelance jobs, suggestions, doubts, queries, etc.
 *
 * @title   Ext.field.Number internationalization demo app.
 *
 * Sencha Fiddle: https://fiddle.sencha.com/#view/editor&fiddle/3coe
 * GitHub repo  : https://github.com/cesarzea/internationalNumberField
 *
 * This is the demo application for internationalNumberField.js
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
Ext.application({
    name: 'International numbers field',

    launch: function () {

        Ext.Viewport.add({
            xtype: 'panel',
            viewModel: true,
            padding: 20,
            items: [
                {
                    xtype: 'panel',
                    title: ' ',
                    width: 350,
                    border: true,
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '',
                            layout: 'vbox',
                            margin: '-10 10 10 10',
                            items: [
                                {
                                    xtype: 'spinnerfield',
                                    label: 'Num of decimals',
                                    minValue: 0,
                                    value: 2,
                                    labelWidth: 150,
                                    bind: {
                                        value: '{numDecimals}'
                                    },
                                    listeners: {
                                        change: function (e, value) {
                                            e.up().down('#nums').query('numberfield').forEach(b => {

                                                b.setDecimals(value);
                                                setRandomValues(e);

                                            })
                                        }
                                    }
                                },
                                {
                                    xtype: 'checkboxfield',
                                    label: 'Show thousands',
                                    checked: true,
                                    labelWidth: 150,
                                    listeners: {
                                        change: function (e, value) {
                                            e.up().down('#nums').query('numberfield').forEach(b => {

                                                b.setShowThousandSeparator(value);
                                                setRandomValues(e);

                                            })
                                        }
                                    }
                                },
                                {
                                    xtype: 'fieldset',
                                    itemId: 'nums',
                                    margin: '-10 0 0 0',
                                    title: '',
                                    flex: 1,
                                    layout: 'vbox',
                                    items: [{
                                        xtype: 'numberfield',
                                        label: 'EEUU format',
                                        labelWidth: 150,

                                        name: 'engValue',
                                        value: 100000.234,

                                        decimals: 2,
                                        decimalSeparator: '.',

                                    },
                                        {
                                            xtype: 'numberfield',
                                            label: 'European format',
                                            labelWidth: 150,

                                            name: 'euValue',
                                            value: 100000.234,

                                            decimals: 2,
                                            decimalSeparator: ','

                                        }]
                                },
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: 'Get values',
                                            flex: 1,
                                            margin: '5 0 0 0',

                                            handler: function (btn) {

                                                let t = btn.up('panel').down("textareafield");
                                                let txt = 'Get values: \n\n';

                                                btn.up('panel').down('#nums').query('numberfield').forEach(b => {
                                                    txt += b.getLabel() + ' : ' + b.getValue() + '\n';
                                                })

                                                t.setValue(txt);
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Set random values',
                                            margin: '5 0 0 5',
                                            flex: 1,
                                            handler: function (btn) {
                                                setRandomValues(btn);
                                            }

                                        }
                                    ]
                                },
                                {
                                    xtype: 'textareafield'
                                }
                            ]

                        }
                    ]
                }
            ]
        });

        function setRandomValues(btn) {
            let t = btn.up('panel').down("textareafield");
            let txt = 'Set random values: \n\n';

            btn.up('panel').down('#nums').query('numberfield').forEach(b => {
                let v = Ext.Number.randomInt(1000, 9999999) + (Ext.Number.randomInt(1000, 9999999) / 9999999);
                txt += b.getLabel() + ' : ' + v + '\n';

                b.setValue("" + v);
            })

            t.setValue(txt);

        }

    }
});
