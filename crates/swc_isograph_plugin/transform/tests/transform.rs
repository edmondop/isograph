use std::path::PathBuf;

use isograph_swc::{relay, Config, OutputFileExtension, RelayLanguageConfig};
use swc_common::FileName;
use swc_ecma_transforms_testing::test_fixture;

#[testing::fixture("tests/fixtures/base/**/input.js")]
fn fixture(input: PathBuf) {
    let output = input.parent().unwrap().join("output.js");

    test_fixture(
        Default::default(),
        &|_| {
            relay(
                &Config {
                    artifact_directory: None,
                    language: RelayLanguageConfig::TypeScript,
                    eager_es_modules: false,
                    output_file_extension: OutputFileExtension::Undefined,
                },
                FileName::Real("file.js".parse().unwrap()),
                Default::default(),
                None,
                None,
            )
        },
        &input,
        &output,
        Default::default(),
    );
}
