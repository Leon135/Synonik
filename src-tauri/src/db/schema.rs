// @generated automatically by Diesel CLI.

diesel::table! {
    base_forms (word_id, base_form_id) {
        word_id -> Integer,
        base_form_id -> Integer,
    }
}

diesel::table! {
    synonym_groups (group_id) {
        group_id -> Integer,
        group_meaning -> Text,
    }
}

diesel::table! {
    word_in_group (word_id, group_id) {
        word_id -> Integer,
        group_id -> Integer,
    }
}

diesel::table! {
    words (id) {
        id -> Integer,
        word -> Text,
    }
}

diesel::joinable!(word_in_group -> synonym_groups (group_id));
diesel::joinable!(word_in_group -> words (word_id));

diesel::allow_tables_to_appear_in_same_query!(base_forms, synonym_groups, word_in_group, words,);
