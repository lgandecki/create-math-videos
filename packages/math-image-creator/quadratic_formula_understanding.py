from manim import *

class QuadraticFormulaUnderstanding(Scene):
    def construct(self):
        # Title
        title = Text("Understanding the Quadratic Formula", font_size=48, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Display the standard quadratic equation
        equation_text = Text("Standard Quadratic Equation:", font_size=36, color=WHITE)
        equation_text.next_to(title, DOWN, buff=1)
        
        quadratic_eq = MathTex(r"ax^2 + bx + c = 0", font_size=56)
        quadratic_eq.next_to(equation_text, DOWN, buff=0.5)
        
        self.play(Write(equation_text))
        self.wait(0.5)
        self.play(Write(quadratic_eq))
        self.wait(2)
        
        # Highlight and define coefficients
        # Create separate MathTex objects for highlighting
        a_coeff = MathTex("a", font_size=56, color=RED)
        x2_term = MathTex("x^2", font_size=56, color=WHITE)
        plus1 = MathTex("+", font_size=56, color=WHITE)
        b_coeff = MathTex("b", font_size=56, color=GREEN)
        x_term = MathTex("x", font_size=56, color=WHITE)
        plus2 = MathTex("+", font_size=56, color=WHITE)
        c_coeff = MathTex("c", font_size=56, color=YELLOW)
        equals = MathTex("=", font_size=56, color=WHITE)
        zero = MathTex("0", font_size=56, color=WHITE)
        
        # Group and position the highlighted equation
        highlighted_eq = VGroup(a_coeff, x2_term, plus1, b_coeff, x_term, plus2, c_coeff, equals, zero)
        highlighted_eq.arrange(RIGHT, buff=0.1)
        highlighted_eq.move_to(quadratic_eq.get_center())
        
        self.play(Transform(quadratic_eq, highlighted_eq))
        self.wait(1)
        
        # Define coefficients with explanations
        definitions_title = Text("Coefficients:", font_size=32, color=WHITE)
        definitions_title.next_to(quadratic_eq, DOWN, buff=1)
        
        a_def = Text("'a' - coefficient of x² term", font_size=28, color=RED)
        b_def = Text("'b' - coefficient of x term", font_size=28, color=GREEN)
        c_def = Text("'c' - constant term", font_size=28, color=YELLOW)
        
        definitions = VGroup(a_def, b_def, c_def)
        definitions.arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        definitions.next_to(definitions_title, DOWN, buff=0.5)
        
        self.play(Write(definitions_title))
        self.wait(0.5)
        
        # Highlight 'a' and show definition
        self.play(
            a_coeff.animate.scale(1.5),
            Write(a_def)
        )
        self.wait(1)
        self.play(a_coeff.animate.scale(1/1.5))
        
        # Highlight 'b' and show definition
        self.play(
            b_coeff.animate.scale(1.5),
            Write(b_def)
        )
        self.wait(1)
        self.play(b_coeff.animate.scale(1/1.5))
        
        # Highlight 'c' and show definition
        self.play(
            c_coeff.animate.scale(1.5),
            Write(c_def)
        )
        self.wait(1)
        self.play(c_coeff.animate.scale(1/1.5))
        self.wait(1)
        
        # Clear previous content and introduce quadratic formula
        self.play(FadeOut(VGroup(equation_text, quadratic_eq, definitions_title, definitions)))
        self.wait(0.5)
        
        # Show quadratic formula
        formula_title = Text("The Quadratic Formula:", font_size=36, color=BLUE)
        formula_title.next_to(title, DOWN, buff=1)
        
        quadratic_formula = MathTex(
            r"x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
            font_size=48
        )
        quadratic_formula.next_to(formula_title, DOWN, buff=0.8)
        
        self.play(Write(formula_title))
        self.wait(0.5)
        self.play(Write(quadratic_formula))
        self.wait(2)
        
        # Explain the formula's purpose
        purpose_text = Text(
            "This formula uses a, b, and c values to find the roots (solutions) of the equation",
            font_size=28,
            color=WHITE
        )
        purpose_text.next_to(quadratic_formula, DOWN, buff=0.8)
        
        self.play(Write(purpose_text))
        self.wait(2)
        
        # Highlight and explain the discriminant
        discriminant_title = Text("The Discriminant:", font_size=32, color=ORANGE)
        discriminant_title.next_to(purpose_text, DOWN, buff=1)
        
        # Create a separate MathTex for the discriminant part
        discriminant = MathTex(r"b^2 - 4ac", font_size=40, color=ORANGE)
        discriminant.next_to(discriminant_title, DOWN, buff=0.5)
        
        # Rectangle around discriminant in the formula
        discriminant_box = SurroundingRectangle(
            quadratic_formula[0][7:12],  # b^2 - 4ac part in the formula
            color=ORANGE,
            buff=0.1
        )
        
        self.play(
            Write(discriminant_title),
            Create(discriminant_box)
        )
        self.wait(1)
        
        self.play(Write(discriminant))
        self.wait(1)
        
        # Explain discriminant's purpose
        discriminant_explanation = Text(
            "The discriminant tells us about the nature of the solutions",
            font_size=26,
            color=WHITE
        )
        discriminant_explanation.next_to(discriminant, DOWN, buff=0.5)
        
        self.play(Write(discriminant_explanation))
        self.wait(2)
        
        # Show discriminant cases
        cases_title = Text("Discriminant Cases:", font_size=28, color=WHITE)
        cases_title.next_to(discriminant_explanation, DOWN, buff=0.8)
        
        case1 = Text("• If b² - 4ac > 0: Two real solutions", font_size=24, color=GREEN)
        case2 = Text("• If b² - 4ac = 0: One real solution", font_size=24, color=YELLOW)
        case3 = Text("• If b² - 4ac < 0: No real solutions", font_size=24, color=RED)
        
        cases = VGroup(case1, case2, case3)
        cases.arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        cases.next_to(cases_title, DOWN, buff=0.5)
        
        self.play(Write(cases_title))
        self.wait(0.5)
        
        self.play(Write(case1))
        self.wait(1)
        self.play(Write(case2))
        self.wait(1)
        self.play(Write(case3))
        self.wait(3)
        
        # Final message
        self.play(FadeOut(VGroup(cases_title, cases, discriminant_explanation)))
        
        final_message = Text(
            "Now you understand the components of the quadratic formula!",
            font_size=32,
            color=BLUE
        )
        final_message.next_to(discriminant, DOWN, buff=1)
        
        self.play(Write(final_message))
        self.wait(3)