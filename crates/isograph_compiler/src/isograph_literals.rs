use std::{
    fs::{self, DirEntry},
    io,
    path::{Path, PathBuf},
};

use lazy_static::lazy_static;
use regex::Regex;

use crate::batch_compile::BatchCompileError;

pub(crate) fn read_files_in_folder(
    canonicalized_root_path: &PathBuf,
) -> Result<Vec<(PathBuf, String)>, BatchCompileError> {
    if !canonicalized_root_path.is_dir() {
        return Err(BatchCompileError::ProjectRootNotADirectory {
            // TODO avoid cloning
            path: canonicalized_root_path.clone(),
        });
    }

    read_dir_recursive(&canonicalized_root_path)?
        .into_iter()
        .filter(has_valid_extension)
        .filter(not_in_artifact_directory)
        .map(|path| read_file(path, canonicalized_root_path))
        .collect()
}

fn has_valid_extension(path: &PathBuf) -> bool {
    let extension = path.extension().and_then(|x| x.to_str());
    match extension {
        Some("ts") | Some("tsx") | Some("js") | Some("jsx") => true,
        _ => false,
    }
}

// TODO do this better
fn not_in_artifact_directory(path: &PathBuf) -> bool {
    !path
        .to_str()
        .expect("Expected path to be stringable")
        .contains("__isograph")
}

fn read_file(
    path: PathBuf,
    canonicalized_root_path: &PathBuf,
) -> Result<(PathBuf, String), BatchCompileError> {
    // This isn't ideal. We can avoid a clone if we changed .map_err to match
    let path_2 = path.clone();

    // N.B. we have previously ensured that path is a file
    let contents = std::fs::read(&path).map_err(|message| BatchCompileError::UnableToReadFile {
        path: path_2,
        message,
    })?;

    let contents = std::str::from_utf8(&contents)
        .map_err(|e| BatchCompileError::UnableToConvertToString {
            path: path.clone(),
            reason: e,
        })?
        .to_owned();

    Ok((
        path.strip_prefix(&canonicalized_root_path)?.to_path_buf(),
        contents,
    ))
}

fn read_dir_recursive(root_js_path: &PathBuf) -> Result<Vec<PathBuf>, BatchCompileError> {
    let mut paths = vec![];

    visit_dirs_skipping_isograph(&root_js_path, &mut |dir_entry| {
        paths.push(dir_entry.path());
    })
    .map_err(BatchCompileError::from)?;

    Ok(paths)
}

// Thanks https://doc.rust-lang.org/stable/std/fs/fn.read_dir.html
fn visit_dirs_skipping_isograph(dir: &Path, cb: &mut dyn FnMut(&DirEntry)) -> io::Result<()> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            if !dir.ends_with(ISOGRAPH_FOLDER) {
                visit_dirs_skipping_isograph(&path, cb)?;
            }
        } else {
            cb(&entry);
        }
    }
    Ok(())
}

pub(crate) static ISOGRAPH_FOLDER: &'static str = "__isograph";
lazy_static! {
    static ref EXTRACT_ISO_LITERAL: Regex =
        Regex::new(r"(export const ([^ ]+) =\s+)?iso(\()?`([^`]+)`(\))?(\()?").unwrap();
}

pub(crate) struct IsoLiteralExtraction<'a> {
    pub(crate) const_export_name: Option<&'a str>,
    pub(crate) iso_literal_text: &'a str,
    pub(crate) iso_literal_start_index: usize,
    pub(crate) has_associated_js_function: bool,
    pub(crate) has_paren: bool,
}

pub(crate) fn extract_iso_literal_from_file_content<'a>(
    content: &'a str,
) -> impl Iterator<Item = IsoLiteralExtraction<'a>> + 'a {
    EXTRACT_ISO_LITERAL
        .captures_iter(content)
        .into_iter()
        .map(|captures| {
            let iso_literal_match = captures.get(4).unwrap();
            IsoLiteralExtraction {
                const_export_name: captures.get(1).map(|_| captures.get(2).unwrap().as_str()),
                iso_literal_text: iso_literal_match.as_str(),
                iso_literal_start_index: iso_literal_match.start(),
                has_associated_js_function: captures.get(6).is_some(),
                has_paren: captures.get(3).is_some(),
            }
        })
}
