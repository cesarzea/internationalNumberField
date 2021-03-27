/*
 * @author  Cesar Pedro Zea Gomez
 *          cesarzea@jaunesistemas.com
 *          https://www.cesarzea.com
 *
 *
 * @title   Working in progress...
 *
 */
Ext.application({
    name: 'International numbers field',

    launch: function () {

        Ext.Viewport.add({
            xtype: 'panel',
            viewModel: true,

            items: [{
                xtype: 'fieldset',
                title: '',
                width: 300,
                layout: 'vbox',
                items: [{
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
                }, {
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
                }, {
                    xtype: 'fieldset',
                    itemId: 'nums',
                    title: '',
                    margin: 0,
                    flex: 1,
                    layout: 'vbox',
                    items: [{
                        xtype: 'numberfield',
                        label: 'English value',

                        name: 'engValue',
                        value: 100000.234,

                        decimals: 2,
                        decimalSeparator: '.',

                    }, {
                        xtype: 'numberfield',
                        label: 'European value',

                        name: 'euValue',
                        value: 100000.234,

                        decimals: 2,
                        decimalSeparator: ','

                    }]
                }, {
                    xtype: 'button',
                    text: 'Get values',
                    flex: 1,
                    margin: '5 0 0 0',

                    handler: function (btn) {

                        let t = btn.up().down("textareafield");
                        let txt = 'Get values: \n\n';

                        btn.up().down('#nums').query('numberfield').forEach(b => {
                            txt += b.getLabel() + ' : ' + b.getValue() + '\n';
                        })

                        t.setValue(txt);
                    }
                }, {
                    xtype: 'button',
                    text: 'Set random values',
                    margin: '5 0 0 0',

                    handler: function (btn) {
                        setRandomValues(btn);
                    }

                }, {
                    xtype: 'textareafield'
                }]

            }]
        });

        function setRandomValues(btn) {
            let t = btn.up().down("textareafield");
            let txt = 'Set values: \n\n';

            btn.up().down('#nums').query('numberfield').forEach(b => {
                let v = Ext.Number.randomInt(1000, 9999999) + (Ext.Number.randomInt(1000, 9999999) / 9999999);
                txt += b.getLabel() + ' : ' + v + '\n';

                b.setValue("" + v);
            })

            t.setValue(txt);
        }


    }
});
