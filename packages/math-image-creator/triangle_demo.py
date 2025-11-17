from manim import *

class TriangleDemo(Scene):
    def construct(self):
        # Title
        title = Text("Triangle in Square: Base on One Side", font_size=24, color=WHITE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create the square
        square = Square(side_length=2.5, color=BLUE, stroke_width=3, fill_opacity=0.1)
        square.shift(LEFT * 2.5)
        
        # Side length label
        side_label = MathTex("s", color=BLUE, font_size=32)
        side_label.next_to(square, DOWN)
        
        self.play(Create(square), Write(side_label))
        self.wait(1)
        
        # Create triangle with base on bottom side, apex on top
        bl = square.get_corner(DL)
        br = square.get_corner(DR)
        top = square.get_top()
        
        triangle = Polygon(bl, br, top, color=GREEN, fill_opacity=0.3, stroke_width=3)
        self.play(Create(triangle))
        self.wait(1)
        
        # Show area formula
        formula1 = MathTex(r"Area = \frac{1}{2} \times base \times height", font_size=20)
        formula1.to_edge(RIGHT).shift(UP * 2)
        self.play(Write(formula1))
        self.wait(1)
        
        # Highlight base and height
        base_line = Line(bl, br, color=RED, stroke_width=4)
        height_line = Line([square.get_center()[0], bl[1], 0], 
                          [square.get_center()[0], top[1], 0], color=RED, stroke_width=4)
        
        self.play(Create(base_line))
        self.wait(0.5)
        self.play(Create(height_line))
        self.wait(1)
        
        # Show base = s, height = s
        formula2 = MathTex(r"Area = \frac{1}{2} \times s \times s", font_size=20)
        formula2.move_to(formula1)
        self.play(Transform(formula1, formula2))
        self.wait(1)
        
        # Simplify to final formula
        formula3 = MathTex(r"Area = \frac{1}{2} s^2", font_size=20, color=YELLOW)
        formula3.move_to(formula1)
        self.play(Transform(formula1, formula3))
        self.wait(1)
        
        # Remove measurement lines
        self.play(FadeOut(base_line), FadeOut(height_line))
        
        # Show sliding animation
        slide_info = Text("Triangle slides, area constant", font_size=18, color=WHITE)
        slide_info.to_edge(DOWN)
        self.play(Write(slide_info))
        
        # Animate sliding apex
        apex_positions = [0.1, 0.4, 0.7, 0.9, 0.5]
        for pos in apex_positions:
            new_apex_x = square.get_left()[0] + pos * 2.5
            new_apex = [new_apex_x, top[1], 0]
            new_triangle = Polygon(bl, br, new_apex, 
                                  color=GREEN, fill_opacity=0.3, stroke_width=3)
            self.play(Transform(triangle, new_triangle), run_time=0.6)
        
        self.wait(1)
        
        # Numerical example
        example = MathTex(r"s = 6 \Rightarrow Area = \frac{1}{2} \times 36 = 18", 
                         font_size=18, color=CYAN)
        example.next_to(formula1, DOWN, buff=0.5)
        self.play(Write(example))
        self.wait(2)
        
        # Final emphasis
        emphasis = Text("Area always equals half the square's area", 
                      font_size=16, color=ORANGE)
        emphasis.next_to(example, DOWN, buff=0.3)
        self.play(Write(emphasis))
        self.wait(3)