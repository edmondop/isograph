use regex::Regex;
use swc_common::sync::Lazy;
use swc_ecma_ast::{Expr, TaggedTpl};
use swc_ecma_visit::{Fold, FoldWith};
use tracing::info;

pub fn isograph() -> impl Fold {
    Isograph {}
}

struct Isograph {}

impl Fold for Isograph {
    fn fold_expr(&mut self, expr: Expr) -> Expr {
        info!("Invoking isograph SWC on expr: {:?}", expr);
        let expr = expr.fold_children_with(self);

        match &expr {
            Expr::TaggedTpl(tpl) => {
                if let Some(built_expr) = self.build_call_expr_from_tpl(tpl) {
                    built_expr
                } else {
                    expr
                }
            }
            _ => expr,
        }
    }
}

impl Isograph {
    fn build_call_expr_from_tpl(&self, tpl: &swc_ecma_ast::TaggedTpl) -> Option<Expr> {
        if let Expr::Ident(ident) = &*tpl.tag {
            if &*ident.sym != "iso" {
                return None;
            }
        }
        let operation_name = pull_first_operation_name_from_tpl(tpl)?;
        info!("operation_name: {}", operation_name);
        None
    }
}

fn pull_first_operation_name_from_tpl(tpl: &TaggedTpl) -> Option<String> {
    static OPERATION_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"(iso) (\w+)").unwrap());

    tpl.tpl.quasis.iter().find_map(|quasis| {
        let capture_group = OPERATION_REGEX.captures_iter(&quasis.raw).next();

        capture_group.map(|capture_group| capture_group[2].to_string())
    })
}
