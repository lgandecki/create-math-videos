from manim import *

class VariablesIntroduction(Scene):
    def construct(self):
        # Create the number 7
        number_7 = Text("7", font_size=72, color=BLUE)
        number_7.move_to(ORIGIN)
        
        # Display the number 7
        self.play(Write(number_7))
        self.wait(1)
        
        # Fade out the number 7
        self.play(FadeOut(number_7))
        self.wait(0.5)
        
        # Create section title
        section_title = Text("Beyond Just Numbers: Variables!", font_size=48, color=GREEN)
        section_title.to_edge(UP, buff=1)
        
        # Display section title
        self.play(Write(section_title))
        self.wait(1)
        
        # Create variable equation using Text instead of MathTex
        x_text = Text("x", font_size=72, color=YELLOW)
        equals_text = Text("=", font_size=72, color=WHITE)
        question_text = Text("?", font_size=72, color=RED)
        
        # Group the equation parts
        variable_equation = VGroup(x_text, equals_text, question_text)
        variable_equation.arrange(RIGHT, buff=0.3)
        variable_equation.move_to(ORIGIN)
        
        # Display variable equation
        self.play(Write(variable_equation))
        self.wait(2)