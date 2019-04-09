function custom_file_browser(field_name, url, type, win) {
    return tinyMCE.activeEditor.windowManager.open({
        title: "Select " + type + " to insert",
        file: window.__filebrowser_url + "?pop=5&type=" + type,
        width: 800,
        height: 500,
        resizable: "yes",
        scrollbars: "yes",
        inline: "yes",
        close_previous: "no"
    }, {
        window: win,
        input: field_name
    }), !1
}
var language_codes = {
    ar: "ar",
    ca: "ca",
    cs: "cs",
    da: "da",
    de: "de",
    es: "es",
    et: "et",
    fa: "fa",
    "fa-ir": "fa_IR",
    fi: "fi",
    fr: "fr_FR",
    "hr-hr": "hr",
    hu: "hu_HU",
    "id-id": "id",
    "is-is": "is_IS",
    it: "it",
    ja: "ja",
    ko: "ko_KR",
    lv: "lv",
    nb: "nb_NO",
    nl: "nl",
    pl: "pl",
    "pt-br": "pt_BR",
    "pt-pt": "pt_PT",
    ru: "ru",
    sk: "sk",
    sr: "sr",
    sv: "sv_SE",
    tr: "tr",
    uk: "uk_UA",
    vi: "vi",
    "zh-cn": "zh_CN",
    "zh-tw": "zh_TW",
    "zh-hant": "zh_TW",
    "zh-hans": "zh_CN"
};
jQuery(function($) {
    "undefined" != typeof tinyMCE && tinyMCE.init({
        selector: "textarea.mceEditor",
        height: "500px",
        language: language_codes[window.__language_code] || "en",
        plugins: ["advlist autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen", "insertdatetime media table contextmenu paste"],
        link_list: window.__link_list_url,
        relative_urls: !1,
        convert_urls: !1,
        menubar: !0,
        statusbar: !1,
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table | code fullscreen",
        image_advtab: !0,
        file_browser_callback: custom_file_browser,
        content_css: [window.__tinymce_css, '/static/css/editor.min.css'] ,
        valid_elements: "*[*]",
        style_formats: [
            {
                title: "Styles d'en-têtes", items: [
                    { title: 'Titre 1', inline: 'h1', classes: 'h1'},
                    { title: 'Titre 2', inline: 'h2', classes: 'h2'},
                    { title: 'Titre 3', inline: 'h3', classes: 'h3'},
                    { title: 'Titre 4', inline: 'h4', classes: 'h4'},
                    { title: 'Titre 5', inline: 'h5', classes: 'h5'},
                    { title: 'Titre 6', inline: 'h6', classes: 'h6'},
                ]

            },
            {
                title: 'Boutons', items: [
                    { title: 'Btn', selector: 'a', classes: 'wys-button'},
                    { title: 'Btn large', selector: 'a', classes: 'wys-button-large'},
                    { title: 'Btn primaire', selector: 'a', classes: 'wys-button-primary'},
                    { title: 'Btn primaire large', selector: 'a', classes: 'wys-button-large-primary'},
                ]
            },
            {
                title: 'Paragraphs', items: [
                    { title: 'Highlighted paragraph', block: 'p', classes: 'wys-highlighted-paragraph'},
                    { title: 'Bloc Rouge', block: 'div', classes: 'wys-block'},
                ]
            },
            
        ],
        style_formats_merge: true
    })
});

//# sourceMappingURL=tinymce_setup.js.map
