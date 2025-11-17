from manim import *

class PiConstantDemonstration(Scene):
    def construct(self):
        # Title
        title = Text("Dlaczego π jest stałe?", font_size=48, color=BLUE)
        subtitle = Text("Stosunek obwodu do średnicy", font_size=32, color=GRAY)
        title.to_edge(UP)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        
        # Create three circles of different sizes
        circles_data = [
            {"radius": 0.5, "color": RED, "label": "Mały"},
            {"radius": 1.0, "color": GREEN, "label": "Średni"},
            {"radius": 1.5, "color": BLUE, "label": "Duży"}
        ]
        
        circles = []
        labels = []
        
        # Position circles horizontally
        for i, data in enumerate(circles_data):
            circle = Circle(radius=data["radius"], color=data["color"], stroke_width=4)
            circle.shift(LEFT * 4 + RIGHT * 4 * i)
            
            label = Text(data["label"], font_size=20, color=data["color"])
            label.next_to(circle, DOWN, buff=0.5)
            
            circles.append(circle)
            labels.append(label)
        
        # Animate circles appearing
        for circle, label in zip(circles, labels):
            self.play(Create(circle), FadeIn(label), run_time=0.5)
        
        self.wait()
        
        # Move everything up to make room
        group = VGroup(*circles, *labels, title, subtitle)
        self.play(group.animate.shift(UP * 1.5))
        
        # Show diameter lines
        diameters = []
        diameter_labels = []
        
        for i, (circle, data) in enumerate(zip(circles, circles_data)):
            diameter_line = Line(
                circle.get_left(), 
                circle.get_right(), 
                color=YELLOW, 
                stroke_width=3
            )
            
            d_value = 2 * data["radius"]
            d_label = MathTex(f"d = {d_value:.1f}", font_size=24, color=YELLOW)
            d_label.next_to(diameter_line, DOWN, buff=0.2)
            
            diameters.append(diameter_line)
            diameter_labels.append(d_label)
        
        for line, label in zip(diameters, diameter_labels):
            self.play(Create(line), Write(label), run_time=0.5)
        
        self.wait()
        
        # Show circumference formula
        formula = MathTex("\\text{Obwód} = \\pi \\cdot d", font_size=36, color=WHITE)
        formula.to_edge(DOWN).shift(UP * 2)
        self.play(Write(formula))
        self.wait()
        
        # Calculate and show circumferences
        circumference_labels = []
        pi_calculations = []
        
        for i, (circle, data) in enumerate(zip(circles, circles_data)):
            c_value = 2 * PI * data["radius"]
            d_value = 2 * data["radius"]
            
            # Show circumference value
            c_label = MathTex(f"C = {c_value:.2f}", font_size=20, color=data["color"])
            c_label.next_to(circle, UP, buff=0.5)
            
            # Show π calculation
            pi_calc = MathTex(
                f"\\pi = \\frac{{C}}{{d}} = \\frac{{{c_value:.2f}}}{{{d_value:.1f}}} = {PI:.3f}",
                font_size=24
            )
            pi_calc.shift(DOWN * 2.5 + LEFT * 4 + RIGHT * 4 * i)
            
            circumference_labels.append(c_label)
            pi_calculations.append(pi_calc)
        
        for label in circumference_labels:
            self.play(FadeIn(label), run_time=0.5)
        
        self.wait()
        
        # Show π calculations one by one
        for calc in pi_calculations:
            self.play(Write(calc), run_time=0.8)
        
        self.wait(2)
        
        # Highlight that all π values are the same
        pi_box = SurroundingRectangle(
            VGroup(*pi_calculations), 
            color=YELLOW, 
            buff=0.2
        )
        
        conclusion = Text(
            "π jest zawsze takie samo!",
            font_size=36, 
            color=YELLOW,
            weight=BOLD
        )
        conclusion.to_edge(DOWN)
        
        self.play(Create(pi_box))
        self.play(Write(conclusion))
        self.wait(2)
        
        # Visual demonstration with unwrapping
        self.play(
            FadeOut(VGroup(
                *circumference_labels, *pi_calculations, 
                pi_box, formula, conclusion
            ))
        )
        
        # Unwrap animation for middle circle
        self.play(
            circles[0].animate.set_fill(opacity=0.2),
            circles[2].animate.set_fill(opacity=0.2),
            labels[0].animate.set_fill(opacity=0.2),
            labels[2].animate.set_fill(opacity=0.2),
            diameters[0].animate.set_stroke(opacity=0.2),
            diameters[2].animate.set_stroke(opacity=0.2),
            diameter_labels[0].animate.set_fill(opacity=0.2),
            diameter_labels[2].animate.set_fill(opacity=0.2),
        )
        
        # Focus on middle circle
        middle_circle = circles[1].copy()
        self.play(middle_circle.animate.move_to(ORIGIN).scale(1.5))
        
        # Create unwrapped circumference
        unwrap_text = Text("Rozwijamy obwód...", font_size=24, color=GRAY)
        unwrap_text.to_edge(DOWN).shift(UP)
        self.play(Write(unwrap_text))
        
        # Create line representing unwrapped circumference
        circumference_line = Line(
            start=LEFT * PI * 1.5,
            end=RIGHT * PI * 1.5,
            color=GREEN,
            stroke_width=6
        )
        circumference_line.shift(DOWN * 1.5)
        
        # Animate unwrapping
        self.play(
            ReplacementTransform(middle_circle.copy(), circumference_line),
            run_time=2
        )
        
        # Show diameter comparison
        diameter_copy = Line(
            start=LEFT * 1.5,
            end=RIGHT * 1.5,
            color=YELLOW,
            stroke_width=6
        )
        diameter_copy.next_to(circumference_line, DOWN, buff=0.5)
        
        self.play(
            ReplacementTransform(diameters[1].copy(), diameter_copy),
            FadeOut(unwrap_text)
        )
        
        # Show how many diameters fit in circumference
        diameter_markers = VGroup()
        for i in range(3):
            marker = Line(
                start=LEFT * 1.5 + RIGHT * 3 * i,
                end=RIGHT * 1.5 + RIGHT * 3 * i,
                color=YELLOW,
                stroke_width=6
            )
            marker.move_to(circumference_line.get_left() + RIGHT * (1.5 + 3 * i))
            diameter_markers.add(marker)
        
        # Add partial diameter
        partial_marker = Line(
            start=LEFT * 1.5 + RIGHT * 9,
            end=LEFT * 1.5 + RIGHT * 9 + RIGHT * 0.42,
            color=YELLOW,
            stroke_width=6
        )
        partial_marker.move_to(circumference_line.get_left() + RIGHT * (1.5 + 9))
        
        count_text = Text("1", font_size=24, color=YELLOW)
        count_text.next_to(diameter_markers[0], DOWN)
        
        self.play(
            ReplacementTransform(diameter_copy, diameter_markers[0]),
            Write(count_text)
        )
        
        for i in range(1, 3):
            new_count = Text(str(i + 1), font_size=24, color=YELLOW)
            new_count.next_to(diameter_markers[i], DOWN)
            self.play(
                FadeIn(diameter_markers[i]),
                Transform(count_text, new_count),
                run_time=0.5
            )
        
        # Show partial
        pi_approx = MathTex("3.14...", font_size=24, color=YELLOW)
        pi_approx.next_to(partial_marker, DOWN)
        
        self.play(
            FadeIn(partial_marker),
            ReplacementTransform(count_text, pi_approx)
        )
        
        # Final message
        final_message = VGroup(
            Text("Obwód = π × średnica", font_size=32, color=WHITE),
            Text("To działa dla KAŻDEGO koła!", font_size=28, color=YELLOW)
        )
        final_message.arrange(DOWN, buff=0.3)
        final_message.to_edge(UP).shift(DOWN * 0.5)
        
        self.play(
            FadeOut(VGroup(middle_circle, *circles, *labels, *diameters, *diameter_labels, title, subtitle)),
            Write(final_message[0])
        )
        self.play(Write(final_message[1]))
        
        self.wait(3)