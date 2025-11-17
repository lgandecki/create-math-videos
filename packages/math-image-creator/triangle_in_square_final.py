from manim import *

class TriangleInSquareFinal(Scene):
    def construct(self):
        # Title
        title = Text("The Simple Case: Base on One Side", font_size=28, color=WHITE)
        title.to_edge(UP, buff=0.3)
        self.play(Write(title))
        self.wait(1)
        
        # Create the square
        square = Square(side_length=3, color=BLUE, stroke_width=3, fill_opacity=0.1)
        square.shift(LEFT * 2)
        
        # Create side length label
        side_label = MathTex("s", color=BLUE, font_size=36)
        side_label.next_to(square, DOWN, buff=0.3)
        
        # Display square with label
        self.play(Create(square), Write(side_label))
        self.wait(1)
        
        # Create triangle inside the square with base on bottom side
        bottom_left = square.get_corner(DL)
        bottom_right = square.get_corner(DR)
        top_center = square.get_top()
        
        triangle = Polygon(bottom_left, bottom_right, top_center, 
                          color=GREEN, fill_opacity=0.3, stroke_width=3)
        
        self.play(Create(triangle))
        self.wait(1)
        
        # Show general triangle area formula on the right
        formula_general = MathTex(r"Area = \frac{1}{2} \times base \times height",
                                 font_size=24, color=YELLOW)
        formula_general.to_edge(RIGHT, buff=0.5).shift(UP * 1.5)
        
        self.play(Write(formula_general))
        self.wait(1)
        
        # Identify base and height
        base_line = Line(bottom_left, bottom_right, color=RED, stroke_width=4)
        height_line = Line([square.get_center()[0], bottom_left[1], 0], 
                          [square.get_center()[0], top_center[1], 0], 
                          color=RED, stroke_width=4)
        
        base_text = Text("base = s", font_size=18, color=RED)
        base_text.next_to(base_line, DOWN, buff=0.1)
        
        height_text = Text("height = s", font_size=18, color=RED)
        height_text.next_to(height_line, RIGHT, buff=0.1)
        
        self.play(Create(base_line), Write(base_text))
        self.wait(1)
        self.play(Create(height_line), Write(height_text))
        self.wait(1)
        
        # Substitute into formula
        formula_sub = MathTex(r"Area = \frac{1}{2} \times s \times s",
                             font_size=24, color=YELLOW)
        formula_sub.move_to(formula_general.get_center())
        
        self.play(Transform(formula_general, formula_sub))
        self.wait(1)
        
        # Simplify
        formula_simple = MathTex(r"Area = \frac{1}{2} s^2",
                               font_size=24, color=YELLOW)
        formula_simple.move_to(formula_general.get_center())
        
        self.play(Transform(formula_general, formula_simple))
        self.wait(1)
        
        # Remove measurement lines
        self.play(FadeOut(base_line), FadeOut(height_line), 
                 FadeOut(base_text), FadeOut(height_text))
        
        # Show sliding animation
        slide_text = Text("Triangle slides but area stays constant", 
                         font_size=20, color=WHITE)
        slide_text.to_edge(DOWN, buff=0.5)
        self.play(Write(slide_text))
        
        # Create sliding triangles
        positions = [0.2, 0.5, 0.8, 0.5]  # Different apex positions
        
        for pos in positions:
            # Apex moves along top edge
            apex_x = square.get_left()[0] + pos * 3  # 3 is square width
            new_apex = [apex_x, top_center[1], 0]
            new_triangle = Polygon(bottom_left, bottom_right, new_apex, 
                                  color=GREEN, fill_opacity=0.3, stroke_width=3)
            self.play(Transform(triangle, new_triangle), run_time=0.8)
        
        self.wait(1)
        
        # Show numerical example
        example_group = VGroup()
        
        example_title = Text("Numerical Example:", font_size=20, color=CYAN)
        example_title.next_to(slide_text, UP, buff=0.3)
        
        s_eq = MathTex("s = 6", font_size=18, color=CYAN)
        s_eq.next_to(example_title, DOWN, buff=0.2)
        
        calc = MathTex(r"Area = \frac{1}{2} \times 6^2 = \frac{1}{2} \times 36 = 18", 
                      font_size=18, color=CYAN)
        calc.next_to(s_eq, DOWN, buff=0.2)
        
        example_group.add(example_title, s_eq, calc)
        
        self.play(Write(example_title))
        self.wait(0.5)
        self.play(Write(s_eq))
        self.wait(0.5)
        self.play(Write(calc))
        self.wait(2)
        
        # Final highlight of the key concept
        key_concept = Text("Key: Base and height both equal s", 
                          font_size=20, color=ORANGE)
        key_concept.next_to(calc, DOWN, buff=0.3)
        self.play(Write(key_concept))
        
        self.wait(3)