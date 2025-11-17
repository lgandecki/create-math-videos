from manim import *

class TriangleInSquare(Scene):
    def construct(self):
        # Create the square
        square_side = 3
        square = Square(side_length=square_side, color=BLUE, stroke_width=3, fill_opacity=0.1)
        
        # Create side length label
        side_label = MathTex("s", color=BLUE, font_size=48)
        side_label.next_to(square.get_bottom(), DOWN, buff=0.2)
        
        # Title
        title = Text("The Simple Case: Base on One Side", font_size=36, color=WHITE)
        title.to_edge(UP, buff=0.5)
        
        # Display title and square
        self.play(Write(title))
        self.wait(1)
        self.play(Create(square), Write(side_label))
        self.wait(1)
        
        # Create triangle inside the square
        # Base coincides with bottom side, apex on top side
        bottom_left = square.get_corner(DL)
        bottom_right = square.get_corner(DR)
        top_center = square.get_top()
        
        triangle = Polygon(bottom_left, bottom_right, top_center, 
                          color=GREEN, fill_opacity=0.3, stroke_width=3)
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Show general triangle area formula
        formula_general = MathTex(r"Area = \frac{1}{2} \times base \times height",
                                 font_size=32, color=YELLOW)
        formula_general.to_edge(RIGHT, buff=1).shift(UP * 2)
        
        self.play(Write(formula_general))
        self.wait(2)
        
        # Highlight base and height
        base_line = Line(bottom_left, bottom_right, color=RED, stroke_width=5)
        height_line = Line([0, bottom_left[1], 0], [0, top_center[1], 0], 
                          color=RED, stroke_width=5)
        
        base_text = Text("base = s", font_size=24, color=RED)
        base_text.next_to(base_line, DOWN, buff=0.1)
        
        height_text = Text("height = s", font_size=24, color=RED)
        height_text.next_to(height_line, LEFT, buff=0.1)
        
        self.play(Create(base_line), Write(base_text))
        self.wait(1)
        self.play(Create(height_line), Write(height_text))
        self.wait(2)
        
        # Substitute values into formula
        formula_substituted = MathTex(r"Area = \frac{1}{2} \times s \times s",
                                     font_size=32, color=YELLOW)
        formula_substituted.move_to(formula_general.get_center())
        
        self.play(Transform(formula_general, formula_substituted))
        self.wait(1)
        
        # Simplify formula
        formula_simplified = MathTex(r"Area = \frac{1}{2} s^2",
                                    font_size=32, color=YELLOW)
        formula_simplified.move_to(formula_general.get_center())
        
        self.play(Transform(formula_general, formula_simplified))
        self.wait(2)
        
        # Remove base and height indicators
        self.play(FadeOut(base_line), FadeOut(height_line), 
                 FadeOut(base_text), FadeOut(height_text))
        
        # Animation: slide base and apex
        sliding_text = Text("The triangle can slide while maintaining the same area", 
                           font_size=28, color=WHITE)
        sliding_text.to_edge(DOWN, buff=0.5)
        self.play(Write(sliding_text))
        
        # Create sliding triangle with varying positions
        def create_sliding_triangle(base_ratio, apex_ratio):
            """Create triangle with base and apex at different positions"""
            base_start = square.get_corner(DL) + RIGHT * square_side * base_ratio * 0.3
            base_end = base_start + RIGHT * square_side * 0.7
            apex = square.get_corner(UL) + RIGHT * square_side * apex_ratio
            return Polygon(base_start, base_end, apex, 
                          color=GREEN, fill_opacity=0.3, stroke_width=3)
        
        # Animate sliding
        for i in range(5):
            base_ratio = i * 0.2
            apex_ratio = (4 - i) * 0.2
            new_triangle = create_sliding_triangle(base_ratio, apex_ratio)
            self.play(Transform(triangle, new_triangle), run_time=0.8)
        
        # Return to center position
        center_triangle = Polygon(bottom_left, bottom_right, top_center, 
                                 color=GREEN, fill_opacity=0.3, stroke_width=3)
        self.play(Transform(triangle, center_triangle))
        self.wait(1)
        
        # Show that area remains constant
        constant_text = Text("Base = s, Height = s, Area remains constant", 
                           font_size=24, color=ORANGE)
        constant_text.move_to(sliding_text.get_center())
        self.play(Transform(sliding_text, constant_text))
        self.wait(2)
        
        # Numerical example
        self.play(FadeOut(sliding_text))
        
        example_title = Text("Numerical Example:", font_size=32, color=WHITE)
        example_title.to_edge(DOWN, buff=2)
        
        s_value = MathTex("s = 6", font_size=28, color=CYAN)
        s_value.next_to(example_title, DOWN, buff=0.3)
        
        calculation1 = MathTex(r"Area = \frac{1}{2} \times 6^2", font_size=28, color=CYAN)
        calculation1.next_to(s_value, DOWN, buff=0.2)
        
        calculation2 = MathTex(r"Area = \frac{1}{2} \times 36", font_size=28, color=CYAN)
        calculation2.next_to(calculation1, DOWN, buff=0.2)
        
        final_result = MathTex(r"Area = 18", font_size=28, color=CYAN)
        final_result.next_to(calculation2, DOWN, buff=0.2)
        
        self.play(Write(example_title))
        self.wait(0.5)
        self.play(Write(s_value))
        self.wait(0.5)
        self.play(Write(calculation1))
        self.wait(0.5)
        self.play(Transform(calculation1, calculation2))
        self.wait(0.5)
        self.play(Write(final_result))
        self.wait(3)
        
        # Final pause
        self.wait(2)