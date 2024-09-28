use swc_core::{
    ecma::{ast::Program, visit::FoldWith},
    plugin::{plugin_transform, proxies::TransformPluginProgramMetadata},
};

mod isograph;
#[plugin_transform]
fn isograph_plugin_transform(
    program: Program,
    metadata: TransformPluginProgramMetadata,
) -> Program {
    program.fold_with(&mut isograph::isograph())
}
