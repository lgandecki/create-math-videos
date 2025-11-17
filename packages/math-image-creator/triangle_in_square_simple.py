from manim import *

class TriangleInSquareSimple(Scene):
    def construct(self):
        # Create the square
        square_side = 3
        square = Square(side_length=square_side, color=BLUE, stroke_width=3, fill_opacity=0.1)
        
        # Create side length label
        side_label = MathTex("s", color=BLUE, font_size=48)
        side_label.next_to(square.get_bottom(), DOWN, buff=0.3)
        
        # Title
        title = Text("Triangle in Square: Base on One Side", font_size=32, color=WHITE)
        title.to_edge(UP, buff=0.5)
        
        # Display title and square
        self.play(Write(title))
        self.wait(1)
        self.play(Create(square), Write(side_label))
        self.wait(1)
        
        # Create triangle inside the square
        bottom_left = square.get_corner(DL)
        bottom_right = square.get_corner(DR)
        top_center = square.get_top()
        
        triangle = Polygon(bottom_left, bottom_right, top_center, 
                          color=GREEN, fill_opacity=0.3, stroke_width=3)
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Show general triangle area formula
        formula_general = MathTex(r"Area = \frac{1}{2} \times base \times height",
                                 font_size=28, color=YELLOW)
        formula_general.to_edge(RIGHT, buff=0.5).shift(UP * 2)
        
        self.play(Write(formula_general))
        self.wait(2)
        
        # Highlight base and height
        base_line = Line(bottom_left, bottom_right, color=RED, stroke_width=5)
        height_line = Line([0, bottom_left[1], 0], [0, top_center[1], 0], 
                          color=RED, stroke_width=5)
        
        base_text = Text("base = s", font_size=20, color=RED)
        base_text.next_to(base_line, DOWN, buff=0.1)
        
        height_text = Text("height = s", font_size=20, color=RED)
        height_text.next_to(height_line, LEFT, buff=0.1)
        
        self.play(Create(base_line), Write(base_text))
        self.wait(1)
        self.play(Create(height_line), Write(height_text))
        self.wait(2)
        
        # Substitute values into formula
        formula_substituted = MathTex(r"Area = \frac{1}{2} \times s \times s",
                                     font_size=28, color=YELLOW)
        formula_substituted.move_to(formula_general.get_center())
        
        self.play(Transform(formula_general, formula_substituted))
        self.wait(1)
        
        # Simplify formula
        formula_simplified = MathTex(r"Area = \frac{1}{2} s^2",
                                    font_size=28, color=YELLOW)
        formula_simplified.move_to(formula_general.get_center())
        
        self.play(Transform(formula_general, formula_simplified))
        self.wait(2)
        
        # Remove base and height indicators
        self.play(FadeOut(base_line), FadeOut(height_line), 
                 FadeOut(base_text), FadeOut(height_text))
        
        # Animation: slide base and apex
        sliding_text = Text("Triangle can slide while area stays constant", 
                           font_size=24, color=WHITE)
        sliding_text.to_edge(DOWN, buff=0.5)
        self.play(Write(sliding_text))
        
        # Create sliding triangles with different positions
        def create_sliding_triangle(base_start_ratio, apex_ratio):
            base_start = square.get_corner(DL) + RIGHT * square_side * base_start_ratio * 0.4
            base_end = base_start + RIGHT * square_side * 0.6
            apex = square.get_corner(UL) + RIGHT * square_side * apex_ratio
            return Polygon(base_start, base_end, apex, 
                          color=GREEN, fill_opacity=0.3, stroke_width=3)
        
        # Animate sliding
        for i in range(4):
            base_ratio = i * 0.25
            apex_ratio = (3 - i) * 0.25
            new_triangle = create_sliding_triangle(base_ratio, apex_ratio)
            self.play(Transform(triangle, new_triangle), run_time=1)
        
        # Return to center position
        center_triangle = Polygon(bottom_left, bottom_right, top_center, 
                                 color=GREEN, fill_opacity=0.3, stroke_width=3)
        self.play(Transform(triangle, center_triangle))
        self.wait(1)
        
        # Simple numerical example
        example_text = Text("Example: s = 6 units", font_size=24, color=CYAN)
        example_text.next_to(sliding_text, UP, buff=0.3)
        
        result_text = MathTex(r"Area = \frac{1}{2} \times 6^2 = 18", font_size=24, color=CYAN)
        result_text.next_to(example_text, DOWN, buff=0.2)
        
        self.play(Write(example_text))
        self.wait(1)
        self.play(Write(result_text))
        self.wait(3)
        
        # Final pause
        self.wait(2)